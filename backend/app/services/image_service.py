"""
AgroVision AI - Image Validation Service

Validates uploaded images: file type, size, dimensions, content integrity.
Does NOT trust file extensions alone – validates actual image content.
"""
from __future__ import annotations

import io
import logging
from typing import Optional, Tuple

from PIL import Image, ExifTags, UnidentifiedImageError

from app.config import (
    ALLOWED_MIME_TYPES,
    MAX_IMAGE_DIMENSION,
    MAX_UPLOAD_SIZE_BYTES,
)

logger = logging.getLogger("agrovision.image")


class ImageValidationError(Exception):
    """Raised when the uploaded image fails validation."""
    pass


def validate_content_type(content_type: Optional[str]) -> None:
    """Validate the Content-Type header."""
    if not content_type:
        raise ImageValidationError("No content type specified.")
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise ImageValidationError(
            f"Unsupported file type: {content_type}. "
            f"Accepted types: JPEG, PNG, WebP."
        )


def validate_file_size(data: bytes) -> None:
    """Validate file size."""
    if len(data) == 0:
        raise ImageValidationError("The uploaded file is empty.")
    max_mb = MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
    if len(data) > MAX_UPLOAD_SIZE_BYTES:
        raise ImageValidationError(
            f"File too large ({len(data) / (1024 * 1024):.1f} MB). "
            f"Maximum allowed: {max_mb:.0f} MB."
        )


def load_and_validate_image(data: bytes) -> Image.Image:
    """
    Decode image bytes, validate content, fix orientation, convert to RGB.
    Returns a PIL Image ready for inference.
    """
    try:
        image = Image.open(io.BytesIO(data))
    except UnidentifiedImageError:
        raise ImageValidationError(
            "The file could not be recognized as a valid image. "
            "Please upload a JPEG, PNG, or WebP image."
        )
    except Exception as exc:
        raise ImageValidationError(f"Failed to open image: {exc}")

    # Verify the format
    img_format = (image.format or "").upper()
    if img_format not in ("JPEG", "JPG", "PNG", "WEBP"):
        raise ImageValidationError(
            f"Unsupported image format: {img_format or 'unknown'}. "
            f"Accepted formats: JPEG, PNG, WebP."
        )

    # Fully load the image to catch truncated files
    try:
        image.load()
    except Exception:
        raise ImageValidationError("The image file appears to be corrupted or truncated.")

    # Check dimensions
    width, height = image.size
    if width < 10 or height < 10:
        raise ImageValidationError(
            f"Image is too small ({width}×{height} px). Minimum: 10×10 px."
        )
    if width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
        raise ImageValidationError(
            f"Image dimensions ({width}×{height} px) exceed the maximum "
            f"allowed ({MAX_IMAGE_DIMENSION}×{MAX_IMAGE_DIMENSION} px)."
        )

    # Fix EXIF orientation
    image = _fix_orientation(image)

    # Convert to RGB
    if image.mode != "RGB":
        try:
            image = image.convert("RGB")
        except Exception:
            raise ImageValidationError("Failed to convert image to RGB colour space.")

    return image


def _fix_orientation(image: Image.Image) -> Image.Image:
    """Apply EXIF orientation if present."""
    try:
        exif = image.getexif()
        if exif:
            orientation_key = None
            for tag, name in ExifTags.TAGS.items():
                if name == "Orientation":
                    orientation_key = tag
                    break
            if orientation_key and orientation_key in exif:
                orientation = exif[orientation_key]
                transforms = {
                    2: Image.FLIP_LEFT_RIGHT,
                    3: Image.ROTATE_180,
                    4: Image.FLIP_TOP_BOTTOM,
                    5: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.ROTATE_270),
                    6: Image.ROTATE_270,
                    7: lambda img: img.transpose(Image.FLIP_LEFT_RIGHT).transpose(Image.ROTATE_90),
                    8: Image.ROTATE_90,
                }
                transform = transforms.get(orientation)
                if transform:
                    if callable(transform) and not isinstance(transform, int):
                        image = transform(image)
                    else:
                        image = image.transpose(transform)
    except Exception:
        pass  # Silently ignore EXIF errors
    return image
