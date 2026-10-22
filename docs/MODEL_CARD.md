# Model Card: Kathir56/plant-disease-tamilnadu

## 1. Model Summary

- **Model Identifier:** `Kathir56/plant-disease-tamilnadu`
- **Hugging Face Model Hub:** [https://huggingface.co/Kathir56/plant-disease-tamilnadu](https://huggingface.co/Kathir56/plant-disease-tamilnadu)
- **Author/Publisher:** Kathir56
- **Model Architecture:** MobileNetV2 fine-tuned for plant leaf disease image classification
- **Input Dimensions:** $3 \times 224 \times 224$ RGB tensors
- **Output:** 38 class logits converted via Softmax into probabilities
- **Framework:** PyTorch & Hugging Face Transformers

> **Scientific Attribution & Transparency:**
> This model was developed externally by Kathir56 and is integrated into AgroVision AI as a pretrained inference engine. AgroVision AI provides the architectural wrapper, validation pipeline, crop guardrails, and advisory intelligence.

---

## 2. Authoritative Class Index & Mapping

The model defines exactly 38 output classes in its authoritative `config.json`. The classes and their index mappings are:

| Index | Raw Model Label | Target Crop Category | Condition | State |
|:---:|:---|:---|:---|:---:|
| 0 | `Apple___Apple_scab` | Apple | Apple scab | Diseased |
| 1 | `Apple___Black_rot` | Apple | Black rot | Diseased |
| 2 | `Apple___Cedar_apple_rust` | Apple | Cedar apple rust | Diseased |
| 3 | `Apple___healthy` | Apple | Healthy | Healthy |
| 4 | `Blueberry___healthy` | Blueberry | Healthy | Healthy |
| 5 | `Cherry_(including_sour)___Powdery_mildew` | Cherry | Powdery mildew | Diseased |
| 6 | `Cherry_(including_sour)___healthy` | Cherry | Healthy | Healthy |
| 7 | `Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot` | Corn | Cercospora / Gray leaf spot | Diseased |
| 8 | `Corn_(maize)___Common_rust_` | Corn | Common rust | Diseased |
| 9 | `Corn_(maize)___Northern_Leaf_Blight` | Corn | Northern Leaf Blight | Diseased |
| 10 | `Corn_(maize)___healthy` | Corn | Healthy | Healthy |
| 11 | `Grape___Black_rot` | Grape | Black rot | Diseased |
| 12 | `Grape___Esca_(Black_Measles)` | Grape | Esca (Black Measles) | Diseased |
| 13 | `Grape___Leaf_blight_(Isariopsis_Leaf_Spot)` | Grape | Leaf blight (Isariopsis) | Diseased |
| 14 | `Grape___healthy` | Grape | Healthy | Healthy |
| 15 | `Orange___Haunglongbing_(Citrus_greening)` | Orange | Haunglongbing (Citrus greening) | Diseased |
| 16 | `Peach___Bacterial_spot` | Peach | Bacterial spot | Diseased |
| 17 | `Peach___healthy` | Peach | Healthy | Healthy |
| 18 | `Pepper,_bell___Bacterial_spot` | Bell Pepper | Bacterial spot | Diseased |
| 19 | `Pepper,_bell___healthy` | Bell Pepper | Healthy | Healthy |
| 20 | `Potato___Early_blight` | Potato | Early blight | Diseased |
| 21 | `Potato___Late_blight` | Potato | Late blight | Diseased |
| 22 | `Potato___healthy` | Potato | Healthy | Healthy |
| 23 | `Raspberry___healthy` | Raspberry | Healthy | Healthy |
| 24 | `Soybean___healthy` | Soybean | Healthy | Healthy |
| 25 | `Squash___Powdery_mildew` | Squash | Powdery mildew | Diseased |
| 26 | `Strawberry___Leaf_scorch` | Strawberry | Leaf scorch | Diseased |
| 27 | `Strawberry___healthy` | Strawberry | Healthy | Healthy |
| 28 | `Tomato___Bacterial_spot` | Tomato | Bacterial spot | Diseased |
| 29 | `Tomato___Early_blight` | Tomato | Early blight | Diseased |
| 30 | `Tomato___Late_blight` | Tomato | Late blight | Diseased |
| 31 | `Tomato___Leaf_Mold` | Tomato | Leaf Mold | Diseased |
| 32 | `Tomato___Septoria_leaf_spot` | Tomato | Septoria leaf spot | Diseased |
| 33 | `Tomato___Spider_mites Two-spotted_spider_mite` | Tomato | Spider mites | Diseased |
| 34 | `Tomato___Target_Spot` | Tomato | Target Spot | Diseased |
| 35 | `Tomato___Tomato_Yellow_Leaf_Curl_Virus` | Tomato | Yellow Leaf Curl Virus | Diseased |
| 36 | `Tomato___Tomato_mosaic_virus` | Tomato | Mosaic virus | Diseased |
| 37 | `Tomato___healthy` | Tomato | Healthy | Healthy |

---

## 3. Supported Target Crops Filter

AgroVision AI specifically targets the 4 principal horticultural crops supported by this model:

1. **Apple (4 classes):** Apple Scab, Black Rot, Cedar Apple Rust, Healthy
2. **Grape (4 classes):** Black Rot, Esca (Black Measles), Leaf Blight, Healthy
3. **Orange (1 class):** Huanglongbing (Citrus Greening)
4. **Tomato (10 classes):** Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy

Total targeted classes: **19 classes** across the 4 focus crops.

---

## 4. Evaluation & Metrics Distinction

### Publisher-Reported Metrics (Laboratory Environment)
- The model author reports convergence on laboratory image benchmarks (such as PlantVillage), where leaves are photographed detached against monochrome paper backgrounds under constant studio illumination.

### Real-World Field Limitations (Application Boundaries)
- **AgroVision AI does not claim that laboratory benchmark accuracy translates directly to outdoor field conditions.**
- Without an independent evaluation benchmark collected across variable real-farm conditions (fluctuating sunlight, overcast skies, background weeds, dirt, and motion blur), accuracy will fluctuate.
- Closed-world Softmax classifiers will attempt to assign one of the 38 classes even to non-plant imagery. AgroVision AI mitigates this with:
  1. Low-confidence warnings ($\text{score} < 0.40$).
  2. Crop mismatch gating (e.g. flagging an image predicted as Tomato when the user designated Apple).
  3. Strict non-prescriptive advisory guidance instructing visual field confirmation with an agronomist.
