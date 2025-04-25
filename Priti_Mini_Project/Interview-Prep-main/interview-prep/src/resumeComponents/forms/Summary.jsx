import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { AIChatSession } from '../../../utils/ResumeAIModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PROMPT =
  "Job Title: {jobTitle}. Generate 3 professional summaries (Senior, Mid-Level, Fresher) in JSON format with 'summary' and 'experience_level' fields. Example format: { summaries: [...] }";


function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState(resumeInfo?.summary || '');
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);


  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, summary }));
  }, [summary, setResumeInfo]);


  const generateSummaryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error('Please enter a job title first');
      return;
    }


    setLoading(true);
    try {
      const result = await AIChatSession.sendMessage(
        PROMPT.replace('{jobTitle}', resumeInfo.jobTitle)
      );
      const text = await result.response.text();
     
      const parsed = JSON.parse(text);
      let summaries = [];


      if (parsed.summaries) {
        summaries = parsed.summaries;
      } else if (parsed.Backend_Summaries) {
        summaries = parsed.Backend_Summaries;
      } else if (Array.isArray(parsed)) {
        summaries = parsed;
      }


      const formattedSummaries = summaries.map(item => ({
        summary: item.summary || item.description || '',
        experience_level: item.experience_level || item.level || 'Not specified'
      }));


      setAiGeneratedSummaryList(formattedSummaries);


      if (formattedSummaries.length === 0) {
        toast.info('No suggestions found in AI response');
      }
    } catch (error) {
      toast.error('Error generating AI suggestions');
    } finally {
      setLoading(false);
    }
  };


  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      const response = await fetch(
        `http://localhost:5000/resume/updateResume/${resumeInfo.resumeId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { summary } }),
        }
      );


      if (!response.ok) throw new Error('Update failed');
     
      enabledNext(true);
      toast.success('Summary saved successfully');
    } catch (error) {
      toast.error(error.message || 'Error saving summary');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg mb-2">Professional Summary</h2>
     
      <form onSubmit={onSave}>
        <div className="flex justify-between items-end mb-4">
          <label className="block text-sm text-gray-600">
            Craft your career snapshot
          </label>
          <button
            type="button"
            onClick={generateSummaryFromAI}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 text-white hover:bg-white hover:text-blue-500 px-3 py-1 rounded border border-blue-500 transition-colors"
          >
            <Brain className="h-4 w-4" />
            {loading ? 'Generating...' : 'AI Suggestions'}
          </button>
        </div>


        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          rows="4"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Example: Experienced software engineer with 5+ years in backend development..."
        />


        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 px-6 py-2 rounded border border-blue-500 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {loading && <LoaderCircle className="animate-spin" />}
            Save Summary
          </button>
        </div>
      </form>


      {aiGeneratedSummaryList.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-3 text-gray-700">AI Suggestions</h3>
          <div className="space-y-4">
            {aiGeneratedSummaryList.map((item, index) => (
              <div
                key={index}
                onClick={() => setSummary(item.summary)}
                className="p-4 border rounded-lg hover:bg-blue-200 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-primary">
                    {item.experience_level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}


export default Summary;

