"""
AgroVision AI - Label Mapping Utility

Derives crop names, disease categories, and display-friendly names
from the actual model id2label mapping. Never invents labels.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple


@dataclass
class ParsedLabel:
    """A single parsed model label."""
    index: int
    raw_label: str
    crop: str
    condition: str
    is_healthy: bool
    display_crop: str
    display_condition: str


@dataclass
class CropInfo:
    """All labels belonging to a single crop."""
    name: str
    display_name: str
    labels: List[ParsedLabel] = field(default_factory=list)

    @property
    def diseases(self) -> List[ParsedLabel]:
        return [lb for lb in self.labels if not lb.is_healthy]

    @property
    def healthy_label(self) -> Optional[ParsedLabel]:
        return next((lb for lb in self.labels if lb.is_healthy), None)


def _clean_condition(raw_condition: str) -> str:
    """Turn the raw condition part into a human-readable display string."""
    # Remove trailing underscores
    text = raw_condition.strip().rstrip("_")
    # Replace underscores with spaces
    text = text.replace("_", " ")
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _clean_crop(raw_crop: str) -> str:
    """Turn the raw crop part into a human-readable display string."""
    text = raw_crop.replace("_", " ").strip()
    # Handle parenthetical info like "Cherry (including sour)"
    text = re.sub(r"\s+", " ", text)
    return text


def parse_label(index: int, raw_label: str) -> ParsedLabel:
    """
    Parse a single model label like 'Apple___Apple_scab' into its components.
    The convention is: Crop___Condition  (separated by triple underscore).
    """
    parts = raw_label.split("___")
    if len(parts) == 2:
        raw_crop, raw_condition = parts
    elif len(parts) == 1:
        # Fallback: no separator found
        raw_crop = parts[0]
        raw_condition = "Unknown"
    else:
        # More than 2 parts – rejoin the condition
        raw_crop = parts[0]
        raw_condition = "___".join(parts[1:])

    display_crop = _clean_crop(raw_crop)
    display_condition = _clean_condition(raw_condition)
    is_healthy = raw_condition.strip().lower() == "healthy"

    return ParsedLabel(
        index=index,
        raw_label=raw_label,
        crop=raw_crop.strip(),
        condition=raw_condition.strip(),
        is_healthy=is_healthy,
        display_crop=display_crop,
        display_condition=display_condition,
    )


def build_label_map(id2label: Dict[int, str]) -> Dict[int, ParsedLabel]:
    """Build a full mapping from label index to ParsedLabel."""
    return {idx: parse_label(idx, label) for idx, label in id2label.items()}


def build_crop_map(
    label_map: Dict[int, ParsedLabel],
    target_crops: Optional[List[str]] = None,
) -> Dict[str, CropInfo]:
    """
    Group parsed labels by crop.
    If target_crops is provided, only include crops that are in the target list
    (matched case-insensitively).
    """
    target_set = None
    if target_crops:
        target_set = {c.lower() for c in target_crops}

    crop_map: Dict[str, CropInfo] = {}
    for parsed in label_map.values():
        crop_key = parsed.crop.lower().replace(" ", "_")

        if target_set is not None:
            # Match against display_crop (case-insensitive)
            if parsed.display_crop.lower() not in target_set:
                continue

        if crop_key not in crop_map:
            crop_map[crop_key] = CropInfo(
                name=parsed.crop,
                display_name=parsed.display_crop,
            )
        crop_map[crop_key].labels.append(parsed)

    return crop_map


def find_crop_for_label(label_map: Dict[int, ParsedLabel], index: int) -> Optional[str]:
    """Return the display crop name for a given label index."""
    parsed = label_map.get(index)
    return parsed.display_crop if parsed else None


def label_matches_crop(label_map: Dict[int, ParsedLabel], index: int, selected_crop: str) -> bool:
    """Check if the predicted label index belongs to the selected crop."""
    parsed = label_map.get(index)
    if parsed is None:
        return False
    return parsed.display_crop.lower() == selected_crop.lower()
