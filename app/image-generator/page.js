'use client';
import { useState } from 'react';
import styles from './ImageGenerator.module.css';
import Logo from '../components/logo';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setImage(data.imageUrl); // Assuming the API returns the image URL
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostOnAnytru = () => {
    // Implement the logic to post on Anytru
    alert('Image posted on Anytru!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <a href="/">
          <img className="logoHeader" src="/images/logo.png" alt="AnyTru" />
        </a>
      </div>
      <h1 className={styles.title}>AI Image Generator</h1>
      <div className={styles.inputDiv}>
      <div className={styles.inputContainer}>
            <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className={styles.input}
            />
            <button onClick={generateImage} disabled={loading || !prompt} className={styles.generateButton}>
            Generate Image
            </button>
        </div>
      </div>

      {loading && <p className={styles.loadingText}>Generating image...</p>}

      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt="Generated" className={styles.generatedImage} />
          <div className={styles.buttonContainer}>
            <button onClick={generateImage} className={styles.regenerateButton}>
              Regenerate
            </button>
            <button onClick={handlePostOnAnytru} className={styles.postButton}>
              Post on Anytru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
