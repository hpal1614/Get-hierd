import React, { useState } from 'react';
import { api } from '../services/api';

export default function JobDescriptionAdapter({ onResumeGenerated }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      const result = await api.adaptResumeToJob(jobDescription);
      setAnalysisResult(result);
      console.log('Job analysis result:', result);
    } catch (error) {
      console.error('Error analyzing job:', error);
      setError('Failed to analyze job description. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const blob = await api.generateJobAdaptedResume(jobDescription);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'job-adapted-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      if (onResumeGenerated) {
        onResumeGenerated(analysisResult?.modifiedResume);
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      setError('Failed to generate job-adapted resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>🎯 Job Description Adapter</h3>
      <p style={{ color: '#666', marginBottom: '15px' }}>
        Paste a job description below and we'll automatically adapt your resume to match the requirements!
      </p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Job Description:
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          style={{
            width: '100%',
            height: '120px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleAnalyzeJob}
          disabled={isAnalyzing || !jobDescription.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            opacity: isAnalyzing ? 0.6 : 1,
            fontSize: '14px'
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Job Requirements'}
        </button>

        <button
          onClick={handleGenerateResume}
          disabled={isGenerating || !jobDescription.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.6 : 1,
            fontSize: '14px'
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Adapted Resume PDF'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      {analysisResult && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          <h4 style={{ marginTop: 0, color: '#155724' }}>✅ Job Analysis Complete!</h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Required Skills:</strong> {analysisResult.jobRequirements.requiredSkills?.join(', ')}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Experience Level:</strong> {analysisResult.jobRequirements.experienceLevel} ({analysisResult.jobRequirements.yearsRequired})
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Industry:</strong> {analysisResult.jobRequirements.industry}
          </div>
          <div>
            <strong>Key Responsibilities:</strong> {analysisResult.jobRequirements.keyResponsibilities?.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
