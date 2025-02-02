'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function AIDiagnosisPage() {
  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleDiagnosis() {
    setLoading(true);
    setDiagnosis(null);

    try {
      const res = await fetch('/api/ai-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, conversationId })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setDiagnosis(data.diagnosis);
      setConversationId(data.conversationId);

    } catch (error) {
      console.error("Diagnosis Error:", error);
      setDiagnosis("Error: Could not get diagnosis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">AI Diagnosis</h1>
      <p className="text-gray-600 mb-4">
        Enter your symptoms, and our AI will suggest possible conditions.
        <br />
        <span className="text-red-500 font-semibold">⚠️ Always consult a real doctor!</span>
      </p>

      <Textarea
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleDiagnosis} disabled={loading}>
        {loading ? 'Analyzing...' : 'Get Diagnosis'}
      </Button>

      {diagnosis && (
        <div className="mt-4 p-4 bg-gray-100 border-l-4 border-blue-500">
          <p className="text-lg font-semibold">AI Diagnosis:</p>
          <div dangerouslySetInnerHTML={{ __html: diagnosis }} /> {/* ✅ Render formatted output */}
        </div>
      )}
    </div>
  )
}
