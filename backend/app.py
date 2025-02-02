from flask import Flask, request, jsonify
import spacy

# Initialize Flask app
app = Flask(__name__)

# Load spaCy's small English model
nlp = spacy.load("en_core_web_sm")

# List of body parts we will be looking for in user input
body_parts = ["head", "chest", "stomach", "shoulder", "back", "arm", "leg", "neck"]

@app.route('/submit-symptoms', methods=['POST'])
def submit_symptoms():
    # Extract user input (symptoms text)
    user_input = request.json.get('symptoms', '')

    if not user_input:
        return jsonify({"error": "No symptoms provided."}), 400

    # Process the input using spaCy NLP
    doc = nlp(user_input)

    # Initialize a list to store the body parts mentioned by the user
    symptoms = []

    # Search for the body parts in the user input
    for body_part in body_parts:
        if body_part in user_input.lower():  # Check if the body part is mentioned in the input
            symptoms.append(body_part)

    # Return identified symptoms as a JSON response
    return jsonify({"symptoms": symptoms})

if __name__ == '__main__':
    app.run(debug=True)