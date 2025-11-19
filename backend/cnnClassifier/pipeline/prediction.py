import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

class PredictionPipeline:
    def __init__(self, filename):
        self.filename = filename
        self.model = load_model("artifacts/training/model.h5", compile=False)  # adjust path if needed
        self.class_names = ["Normal", "Tumor"]   # must match your training labels

    def predict(self):
        # Load and preprocess image
        img = image.load_img(self.filename, target_size=(224, 224))  # use your training size
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # same scaling as training

        # Predict
        preds = self.model.predict(img_array)
        predicted_class = self.class_names[np.argmax(preds)]

        return predicted_class
