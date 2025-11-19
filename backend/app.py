# from flask import Flask, request, jsonify, render_template
# import os
# from flask_cors import CORS, cross_origin
# import base64
# import numpy as np
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image

# # Setup env
# os.putenv('LANG', 'en_US.UTF-8')
# os.putenv('LC_ALL', 'en_US.UTF-8')

# app = Flask(__name__)
# CORS(app)

# # Load trained model
# MODEL_PATH = "model/model.h5"
# model = load_model(MODEL_PATH, compile=False)

# # Classes
# CLASS_NAMES = ["Normal", "Tumor"]

# def decodeImage(imgstring, fileName):
#     """Decode base64 string to image file"""
#     imgdata = base64.b64decode(imgstring)
#     with open(fileName, 'wb') as f:
#         f.write(imgdata)

# class PredictionPipeline:
#     def __init__(self, filename):
#         self.filename = filename

#     def predict(self):
#         # Preprocess image
#         img = image.load_img(self.filename, target_size=(224, 224))  # ❗ Change if trained with different size
#         img_array = image.img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array = img_array / 255.0  # ❗ Ensure same scaling as training

#         # Predict
#         preds = model.predict(img_array)
#         predicted_class = CLASS_NAMES[np.argmax(preds)]

#         return predicted_class


# class ClientApp:
#     def __init__(self):
#         self.filename = "inputImage.jpg"
#         self.classifier = PredictionPipeline(self.filename)


# @app.route("/", methods=['GET'])
# @cross_origin()
# def home():
#     return render_template('index.html')


# @app.route("/train", methods=['GET', 'POST'])
# @cross_origin()
# def trainRoute():
#     os.system("python main.py")   # retrains model
#     return "Training done successfully!"


# @app.route("/predict", methods=['POST'])
# @cross_origin()
# def predictRoute():
#     image = request.json['image']
#     decodeImage(image, clApp.filename)
#     result = clApp.classifier.predict()
#     return jsonify(result)


# if __name__ == "__main__":
#     clApp = ClientApp()
#     app.run(host='0.0.0.0', port=8080)  # for AWS / local
from flask import Flask, request, jsonify
import os
from flask_cors import CORS, cross_origin
import base64
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image

# --------------------------
# Environment Setup
# --------------------------
os.environ['LANG'] = 'en_US.UTF-8'
os.environ['LC_ALL'] = 'en_US.UTF-8'

# --------------------------
# Flask App Init
# --------------------------
app = Flask(__name__)
CORS(app)

# --------------------------
# Model Loading
# --------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.h5")

# Load trained model
model = load_model(MODEL_PATH, compile=False)

# --------------------------
# Classes
# --------------------------
CLASS_NAMES = ["Normal", "Tumor"]


# --------------------------
# Utility: Decode Base64 Image
# --------------------------
def decodeImage(imgstring, fileName):
    """
    Decode base64 string to image file.
    """
    imgdata = base64.b64decode(imgstring)
    with open(fileName, 'wb') as f:
        f.write(imgdata)


# --------------------------
# Prediction Pipeline
# --------------------------
class PredictionPipeline:
    def __init__(self, filename):
        self.filename = filename

    def predict(self):
        # Preprocess image
        img = keras_image.load_img(self.filename, target_size=(224, 224))  # change size if needed
        img_array = keras_image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # must match training preprocessing

        # Predict
        preds = model.predict(img_array)
        predicted_index = int(np.argmax(preds))
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(np.max(preds))

        # You can return both label and confidence
        return {
            "class": predicted_class,
            "class_index": predicted_index,
            "confidence": confidence
        }


# --------------------------
# ClientApp Wrapper
# --------------------------
class ClientApp:
    def __init__(self):
        self.filename = "inputImage.jpg"
        self.classifier = PredictionPipeline(self.filename)


# Create global instance so it's available whether run via app.run or WSGI
clApp = ClientApp()


# --------------------------
# Routes
# --------------------------

@app.route("/", methods=['GET'])
@cross_origin()
def home():
    """
    Health-check route.
    If you want to use HTML later, you can switch this to render_template.
    """
    return jsonify({"message": "Kidney tumor classifier backend is running ✅"}), 200


@app.route("/train", methods=['GET', 'POST'])
@cross_origin()
def trainRoute():
    """
    Trigger retraining (make sure main.py exists and is correct).
    """
    os.system("python main.py")
    return "Training done successfully!"


@app.route("/predict", methods=['POST'])
@cross_origin()
def predictRoute():
    """
    Accepts JSON:
    {
        "image": "<base64-string>"
    }
    Returns:
    {
        "class": "Normal" or "Tumor",
        "class_index": 0 or 1,
        "confidence": 0.95 (etc)
    }
    """
    try:
        data = request.get_json()

        if data is None or 'image' not in data:
            return jsonify({"error": "No image field found in JSON body"}), 400

        img_str = data['image']  # base64 string from frontend

        # Decode and save image
        decodeImage(img_str, clApp.filename)

        # Predict
        result = clApp.classifier.predict()

        return jsonify(result), 200

    except Exception as e:
        # Log error and return 500
        print("Error during prediction:", e)
        return jsonify({"error": str(e)}), 500


# --------------------------
# Main
# --------------------------
if __name__ == "__main__":
    # For dev / simple deployment
    # In real production, use a WSGI server like gunicorn:
    # gunicorn app:app --bind 0.0.0.0:8080
    app.run(host='0.0.0.0', port=8080)
