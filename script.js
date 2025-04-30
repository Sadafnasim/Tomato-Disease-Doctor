// Disease descriptions
const diseaseDescriptions = {
    "Bacterial spot": {
      description: "Bacterial spot is caused by the bacterium Xanthomonas campestris. It causes dark, water-soaked lesions on leaves, stems, and fruit.",
      prevention: "Use resistant varieties, practice crop rotation, and avoid overhead irrigation to reduce leaf wetness.",
      severity: "danger"
    },
    "Early blight": {
      description: "Early blight is caused by the fungus Alternaria solani. It causes dark, concentric spots on the leaves and can lead to defoliation.",
      prevention: "Use disease-resistant varieties, apply fungicides, and practice crop rotation.",
      severity: "warning"
    },
    "Late blight": {
      description: "Late blight is caused by the water mold Phytophthora infestans. It leads to large, irregular, water-soaked lesions, often with a white, fungal growth.",
      prevention: "Use resistant varieties, apply fungicides, and remove infected plant debris.",
      severity: "danger"
    },
    "Leaf Mold": {
      description: "Leaf mold is caused by the fungus Passalora fulva. It affects the upper side of leaves, creating yellow spots that turn into a moldy mass.",
      prevention: "Maintain good air circulation, avoid overhead watering, and remove infected leaves.",
      severity: "warning"
    },
    "Septoria leaf spot": {
      description: "Septoria leaf spot is caused by the fungus Septoria lycopersici. It causes small, round, dark spots on the leaves.",
      prevention: "Use fungicides and remove infected plant debris.",
      severity: "warning"
    },
    "Spider mites": {
      description: "Spider mites are tiny arachnids that cause a stippling effect on leaves and webbing on the plant. They thrive in dry conditions.",
      prevention: "Use miticides, introduce natural predators, and keep humidity levels high.",
      severity: "warning"
    },
    "Target Spot": {
      description: "Target spot is caused by the fungus Corynespora cassiicola. It causes dark, circular lesions with concentric rings.",
      prevention: "Use resistant varieties, apply fungicides, and practice crop rotation.",
      severity: "warning"
    },
    "Yellow Leaf Curl Virus": {
      description: "This virus causes curling and yellowing of the tomato leaves, stunting plant growth and reducing yield.",
      prevention: "Control aphids, which transmit the virus, and remove infected plants.",
      severity: "danger"
    },
    "Tomato Mosaic Virus": {
      description: "This virus causes mottled, mosaic patterns on leaves and stunted plant growth.",
      prevention: "Remove infected plants and control aphids that spread the virus.",
      severity: "danger"
    },
    "Healthy": {
      description: "The plant shows no symptoms of disease and is in good health.",
      prevention: "Maintain regular care practices like proper watering, soil management, and pest control.",
      severity: "healthy"
    }
  };
  
  // DOM Elements
  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('fileInput');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const removeBtn = document.getElementById('removeBtn');
  const predictBtn = document.getElementById('predictBtn');
  const resultsContainer = document.getElementById('resultsContainer');
  const loader = document.getElementById('loader');
  const results = document.getElementById('results');
  const diagnosisIcon = document.getElementById('diagnosisIcon');
  const diagnosisTitle = document.getElementById('diagnosisTitle');
  const diagnosisDescription = document.getElementById('diagnosisDescription');
  const treatmentText = document.getElementById('treatmentText');
  const confidenceScore = document.getElementById('confidenceScore');
  
  // Event Listeners
  dropArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  removeBtn.addEventListener('click', removeImage);
  predictBtn.addEventListener('click', predictDisease);
  
  // Drag and Drop functionality
  ['dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  ['dragenter', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.add('active'), false));
  ['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.remove('active'), false));
  dropArea.addEventListener('drop', handleDrop, false);
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      fileInput.files = files;
      handleFileSelect();
    }
  }
  
  function handleFileSelect() {
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        dropArea.style.display = 'none';
        previewContainer.style.display = 'block';
        resultsContainer.style.display = 'none';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }
  
  function removeImage(e) {
    e.stopPropagation();
    fileInput.value = '';
    previewImage.src = '';
    previewContainer.style.display = 'none';
    dropArea.style.display = 'block';
    resultsContainer.style.display = 'none';
  }
  
  async function predictDisease() {
    if (!fileInput.files.length) {
      alert('Please upload an image first.');
      return;
    }
  
    resultsContainer.style.display = 'block';
    loader.style.display = 'block';
    results.style.display = 'none';
  
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('https://b8a8-34-143-163-82.ngrok-free.app/predict', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) throw new Error('Server returned an error.');
  
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Error:', error);
      loader.style.display = 'none';
      results.style.display = 'block';
  
      diagnosisIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
      diagnosisIcon.className = 'diagnosis-icon danger';
      diagnosisTitle.textContent = 'Error';
      diagnosisDescription.textContent = 'There was an error processing your image. Please try again.';
      treatmentText.textContent = 'Make sure you have a stable internet connection and the server is running.';
      confidenceScore.textContent = 'Confidence: N/A';
    }
  }
  
  function displayResults(data) {
    loader.style.display = 'none';
    results.style.display = 'block';
  
    const predictedLabel = data.prediction;
    const simplifiedLabel = predictedLabel.replace('Tomato___', '').replace(/_/g, ' ');
    const confidence = Math.round(data.confidence * 100) || 95;
  
    confidenceScore.textContent = `Confidence: ${confidence}%`;
  
    const info = diseaseDescriptions[simplifiedLabel] || {
      description: 'No description available.',
      prevention: 'General plant care.',
      severity: 'warning'
    };
  
    diagnosisTitle.textContent = simplifiedLabel;
    diagnosisDescription.textContent = info.description;
    treatmentText.textContent = info.prevention;
  
    diagnosisIcon.className = `diagnosis-icon ${info.severity}`;
    diagnosisIcon.innerHTML = {
      healthy: '<i class="fas fa-check-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      danger: '<i class="fas fa-times-circle"></i>'
    }[info.severity] || '<i class="fas fa-exclamation-circle"></i>';
  
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Smooth scroll
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
  
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Update nav on scroll
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
  
      if (scrollPosition >= top && scrollPosition < top + height) {
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`nav a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });
  
  // On load
  window.addEventListener('DOMContentLoaded', () => {
    previewContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    document.querySelector('nav a')?.classList.add('active');
  });
  
