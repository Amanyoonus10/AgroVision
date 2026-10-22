"""
AgroVision AI - Disease Information Knowledge Base

Curated, verified information for disease categories that the model actually supports.
Only includes diseases for the four target crops: Apple, Grape, Orange, Tomato.
Does NOT recommend specific pesticides or dosages.
"""
from __future__ import annotations

from typing import Dict, Optional

DISEASE_INFO: Dict[str, Dict] = {
    # ─── APPLE ────────────────────────────────────────────
    "Apple___Apple_scab": {
        "disease_name": "Apple Scab",
        "crop": "Apple",
        "description": (
            "Apple scab is a fungal disease caused by Venturia inaequalis. "
            "It is one of the most common and economically important diseases of apple trees worldwide."
        ),
        "symptoms": [
            "Olive-green to dark brown velvety spots on leaves",
            "Scabby, rough-textured lesions on fruit surfaces",
            "Premature leaf drop in severe infections",
            "Distorted or cracked fruit",
        ],
        "guidance": [
            "Remove and destroy fallen leaves in autumn to reduce overwintering spores",
            "Ensure good air circulation through proper pruning",
            "Consider disease-resistant apple varieties for new plantings",
            "Consult a local agricultural extension service for approved fungicide programs",
        ],
        "seek_expert_when": "Infection is widespread, fruit quality is significantly affected, or previous management strategies have been ineffective.",
    },
    "Apple___Black_rot": {
        "disease_name": "Black Rot",
        "crop": "Apple",
        "description": (
            "Black rot is caused by the fungus Botryosphaeria obtusa. "
            "It affects fruit, leaves, and bark of apple trees."
        ),
        "symptoms": [
            "Frogeye leaf spots – circular tan lesions with dark purple borders",
            "Large, expanding brown to black rot on fruit",
            "Fruit mummification – shrivelled, hard black fruit",
            "Cankers on branches and trunk",
        ],
        "guidance": [
            "Prune out dead wood and cankers during dormant season",
            "Remove mummified fruit from trees and the ground",
            "Maintain tree vigor through proper fertilization and watering",
            "Consult an agricultural advisor for regional management recommendations",
        ],
        "seek_expert_when": "Cankers are large or spreading, or fruit losses are increasing year over year.",
    },
    "Apple___Cedar_apple_rust": {
        "disease_name": "Cedar Apple Rust",
        "crop": "Apple",
        "description": (
            "Cedar apple rust is caused by Gymnosporangium juniperi-virginianae. "
            "It requires both apple/crabapple and eastern red cedar (Juniperus virginiana) to complete its life cycle."
        ),
        "symptoms": [
            "Bright orange-yellow spots on upper leaf surfaces",
            "Tube-like structures (aecia) on the undersides of leaves",
            "Spots may also appear on fruit and young twigs",
            "Premature defoliation in severe cases",
        ],
        "guidance": [
            "If feasible, remove nearby cedar or juniper hosts within several hundred meters",
            "Plant rust-resistant apple cultivars",
            "Monitor trees in spring when conditions favor spore release",
            "Contact a local extension office for fungicide timing recommendations",
        ],
        "seek_expert_when": "Disease severity increases despite removal of nearby cedar hosts, or resistant varieties are unavailable.",
    },
    "Apple___healthy": {
        "disease_name": "Healthy",
        "crop": "Apple",
        "description": "The leaf appears to be in a healthy condition with no visible signs of disease.",
        "symptoms": [],
        "guidance": [
            "Continue regular monitoring for early signs of disease",
            "Maintain good cultural practices including proper spacing and pruning",
            "Ensure adequate nutrition and water management",
        ],
        "seek_expert_when": "You notice any new spots, discolouration, or unusual changes on leaves or fruit.",
    },

    # ─── GRAPE ────────────────────────────────────────────
    "Grape___Black_rot": {
        "disease_name": "Black Rot",
        "crop": "Grape",
        "description": (
            "Grape black rot is caused by the fungus Guignardia bidwellii. "
            "It can cause severe yield losses if not managed."
        ),
        "symptoms": [
            "Small, circular tan spots on leaves with dark borders",
            "Brown to black lesions on shoots and tendrils",
            "Fruit turns brown, then black and shrivelled (mummified)",
            "Tiny black pycnidia visible in leaf spots and mummified berries",
        ],
        "guidance": [
            "Remove and destroy mummified fruit and infected plant debris",
            "Improve air circulation through canopy management and training",
            "Time preventative sprays before bloom through early fruit development",
            "Consult regional viticulture extension services for specific recommendations",
        ],
        "seek_expert_when": "Significant fruit loss occurs or the disease has not responded to previous management.",
    },
    "Grape___Esca_(Black_Measles)": {
        "disease_name": "Esca (Black Measles)",
        "crop": "Grape",
        "description": (
            "Esca, also known as black measles, is a complex grapevine trunk disease "
            "associated with multiple fungal pathogens including Phaeomoniella chlamydospora "
            "and Phaeoacremonium species."
        ),
        "symptoms": [
            "Interveinal chlorosis and necrosis creating a tiger-stripe pattern on leaves",
            "Dark spots or streaks on berries (measles)",
            "Internal wood discolouration and necrosis",
            "Sudden vine death (apoplexy) in severe cases",
        ],
        "guidance": [
            "Protect pruning wounds to reduce infection entry points",
            "Avoid severe pruning during wet conditions",
            "Remove and destroy severely affected vines",
            "There is no established cure – consult a viticulture specialist",
        ],
        "seek_expert_when": "Multiple vines show symptoms, or vine decline is observed.",
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "disease_name": "Leaf Blight (Isariopsis Leaf Spot)",
        "crop": "Grape",
        "description": (
            "Grape leaf blight, also called Isariopsis leaf spot, is caused by the fungus "
            "Pseudocercospora vitis. It typically occurs in warm, humid conditions."
        ),
        "symptoms": [
            "Angular, dark brown spots on leaves",
            "Lesions may coalesce, causing large necrotic areas",
            "Premature leaf drop affecting vine vigour",
        ],
        "guidance": [
            "Ensure good vineyard sanitation by removing fallen leaves",
            "Improve air circulation through proper canopy management",
            "Avoid overhead irrigation that keeps foliage wet",
            "Seek advice from a viticulture extension office for management options",
        ],
        "seek_expert_when": "Premature defoliation is severe or yield is significantly affected.",
    },
    "Grape___healthy": {
        "disease_name": "Healthy",
        "crop": "Grape",
        "description": "The grapevine leaf appears to be in a healthy condition.",
        "symptoms": [],
        "guidance": [
            "Continue routine scouting for disease symptoms",
            "Maintain balanced canopy management",
            "Monitor soil moisture and nutrition",
        ],
        "seek_expert_when": "Any unusual discolouration, spots, or wilting appears.",
    },

    # ─── ORANGE ───────────────────────────────────────────
    "Orange___Haunglongbing_(Citrus_greening)": {
        "disease_name": "Huanglongbing (Citrus Greening)",
        "crop": "Orange",
        "description": (
            "Huanglongbing (HLB), also known as citrus greening, is a devastating bacterial disease "
            "caused by Candidatus Liberibacter species. It is spread by the Asian citrus psyllid insect."
        ),
        "symptoms": [
            "Asymmetric blotchy mottling of leaves (yellow-green patches)",
            "Leaves may be small, upright, and show zinc-deficiency-like symptoms",
            "Fruit is lopsided, small, and poorly coloured",
            "Seeds are often aborted; fruit tastes bitter",
            "Progressive decline and dieback of the tree",
        ],
        "guidance": [
            "There is currently no cure for HLB",
            "Report suspected infections to local agricultural authorities immediately",
            "Control the Asian citrus psyllid vector through integrated pest management",
            "Remove and destroy confirmed infected trees to reduce spread",
            "Use certified disease-free nursery stock for new plantings",
        ],
        "seek_expert_when": "Any symptoms of HLB are suspected – early detection is critical for containment.",
    },

    # ─── TOMATO ───────────────────────────────────────────
    "Tomato___Bacterial_spot": {
        "disease_name": "Bacterial Spot",
        "crop": "Tomato",
        "description": (
            "Bacterial spot of tomato is caused by several Xanthomonas species. "
            "It thrives in warm, wet conditions."
        ),
        "symptoms": [
            "Small, dark, water-soaked spots on leaves",
            "Spots may have a yellow halo",
            "Raised, scabby lesions on fruit",
            "Severe defoliation in favourable conditions",
        ],
        "guidance": [
            "Use certified disease-free seed and transplants",
            "Avoid overhead irrigation",
            "Rotate crops – avoid planting tomatoes or peppers in the same location for 2-3 years",
            "Consult a local extension service for copper-based management options",
        ],
        "seek_expert_when": "Large areas of the crop are affected or fruit quality is significantly reduced.",
    },
    "Tomato___Early_blight": {
        "disease_name": "Early Blight",
        "crop": "Tomato",
        "description": (
            "Early blight is caused by Alternaria solani. "
            "It is one of the most common tomato leaf diseases worldwide."
        ),
        "symptoms": [
            "Dark brown spots with concentric rings (target-like pattern) on lower leaves first",
            "Yellowing around leaf spots",
            "Progressive defoliation from the bottom of the plant upward",
            "Dark, sunken lesions near the stem end of fruit",
        ],
        "guidance": [
            "Remove and destroy affected lower leaves",
            "Mulch around plants to prevent soil splash",
            "Ensure adequate plant spacing for air circulation",
            "Rotate with non-solanaceous crops for at least 2 years",
        ],
        "seek_expert_when": "Defoliation is rapid and threatens fruit production.",
    },
    "Tomato___Late_blight": {
        "disease_name": "Late Blight",
        "crop": "Tomato",
        "description": (
            "Late blight is caused by the oomycete Phytophthora infestans. "
            "It can destroy an entire crop within days under favourable cool, wet conditions."
        ),
        "symptoms": [
            "Large, water-soaked, pale green to brown lesions on leaves",
            "White fuzzy growth (sporangia) on the underside of leaves in humid conditions",
            "Firm, dark brown lesions on stems",
            "Greasy, dark spots on fruit",
        ],
        "guidance": [
            "Remove and destroy infected plants immediately – do not compost",
            "Avoid overhead watering; improve air circulation",
            "Plant resistant varieties when available",
            "Contact extension services urgently – late blight can spread rapidly in a region",
        ],
        "seek_expert_when": "Any suspected late blight should be reported immediately due to its highly destructive nature.",
    },
    "Tomato___Leaf_Mold": {
        "disease_name": "Leaf Mold",
        "crop": "Tomato",
        "description": (
            "Tomato leaf mold is caused by the fungus Passalora fulva (formerly Cladosporium fulvum). "
            "It is most problematic in greenhouse environments with high humidity."
        ),
        "symptoms": [
            "Pale yellowish-green spots on upper leaf surfaces",
            "Olive-green to greyish-brown velvety growth on leaf undersides",
            "Leaves may curl and wither",
            "Can reduce yield through defoliation",
        ],
        "guidance": [
            "Improve ventilation in greenhouses",
            "Reduce humidity through proper spacing and watering practices",
            "Remove and destroy affected foliage",
            "Choose resistant varieties where available",
        ],
        "seek_expert_when": "The disease is spreading despite improved environmental control.",
    },
    "Tomato___Septoria_leaf_spot": {
        "disease_name": "Septoria Leaf Spot",
        "crop": "Tomato",
        "description": (
            "Septoria leaf spot is caused by the fungus Septoria lycopersici. "
            "It commonly occurs in warm, wet weather."
        ),
        "symptoms": [
            "Numerous small (1-3 mm), circular spots with dark brown margins and grey centres",
            "Tiny dark dots (pycnidia) visible in the centre of spots",
            "Lower leaves affected first, progressing upward",
            "Severe defoliation reduces fruit size and quality",
        ],
        "guidance": [
            "Remove and destroy infected lower leaves promptly",
            "Mulch to reduce soil splash onto foliage",
            "Avoid working in wet plants to prevent spread",
            "Practice crop rotation with non-host crops",
        ],
        "seek_expert_when": "Defoliation is extensive or fruit sunscald occurs due to leaf loss.",
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "disease_name": "Spider Mites (Two-spotted Spider Mite)",
        "crop": "Tomato",
        "description": (
            "Two-spotted spider mites (Tetranychus urticae) are tiny arachnids that feed on plant cells. "
            "They are not a disease but a pest, and infestations are common in hot, dry conditions."
        ),
        "symptoms": [
            "Fine stippling (tiny yellow or white dots) on leaf surfaces",
            "Fine webbing on leaf undersides and between leaves",
            "Leaves may turn yellow, bronze, or dry out",
            "Severe infestations can cause defoliation",
        ],
        "guidance": [
            "Increase humidity around plants where possible",
            "Spray plants with a strong jet of water to dislodge mites",
            "Encourage natural predators such as ladybirds and predatory mites",
            "Consult a pest management advisor for severe infestations",
        ],
        "seek_expert_when": "Infestation is widespread and natural control methods are insufficient.",
    },
    "Tomato___Target_Spot": {
        "disease_name": "Target Spot",
        "crop": "Tomato",
        "description": (
            "Target spot is caused by the fungus Corynespora cassiicola. "
            "It can affect leaves, stems, and fruit."
        ),
        "symptoms": [
            "Small, dark brown spots that enlarge into target-like concentric rings",
            "Lesions often appear on older leaves first",
            "Significant defoliation in severe cases",
            "Sunken lesions on fruit near the stem scar",
        ],
        "guidance": [
            "Remove lower leaves that are most susceptible",
            "Improve air circulation and reduce leaf wetness",
            "Practice crop rotation",
            "Consult extension services for suitable management practices",
        ],
        "seek_expert_when": "Disease progresses rapidly or fruit yield is affected.",
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "disease_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "crop": "Tomato",
        "description": (
            "TYLCV is a geminivirus transmitted by the whitefly Bemisia tabaci. "
            "It is a serious viral disease in tropical and subtropical tomato production."
        ),
        "symptoms": [
            "Upward curling and cupping of leaves",
            "Yellowing of leaf margins",
            "Stunted plant growth",
            "Reduced fruit set; flowers may drop",
        ],
        "guidance": [
            "Use resistant or tolerant tomato varieties",
            "Control whitefly populations through integrated pest management",
            "Use reflective mulches to deter whiteflies",
            "Remove and destroy infected plants promptly",
        ],
        "seek_expert_when": "Whitefly populations are high or multiple plants show symptoms.",
    },
    "Tomato___Tomato_mosaic_virus": {
        "disease_name": "Tomato Mosaic Virus (ToMV)",
        "crop": "Tomato",
        "description": (
            "Tomato mosaic virus is highly stable and easily transmitted mechanically "
            "through contaminated hands, tools, and plant debris."
        ),
        "symptoms": [
            "Mottled light and dark green mosaic pattern on leaves",
            "Leaf distortion, curling, or fernleaf appearance",
            "Stunted growth",
            "Reduced and uneven fruit ripening",
        ],
        "guidance": [
            "Wash hands and disinfect tools before handling plants",
            "Use certified virus-free seed",
            "Remove and destroy infected plants",
            "Plant resistant varieties (those with the Tm-2² gene)",
        ],
        "seek_expert_when": "Multiple plants are infected or the virus is suspected in nursery stock.",
    },
    "Tomato___healthy": {
        "disease_name": "Healthy",
        "crop": "Tomato",
        "description": "The tomato leaf appears to be in a healthy condition with no visible signs of disease.",
        "symptoms": [],
        "guidance": [
            "Continue regular scouting for pests and diseases",
            "Maintain proper staking, pruning, and watering practices",
            "Monitor for early signs of nutrient deficiency",
        ],
        "seek_expert_when": "Any unusual symptoms appear on leaves, stems, or fruit.",
    },
}


def get_disease_info(raw_label: str) -> Optional[Dict]:
    """Look up curated disease information for a model label."""
    return DISEASE_INFO.get(raw_label)


def get_all_disease_info() -> Dict[str, Dict]:
    """Return the entire knowledge base."""
    return DISEASE_INFO
