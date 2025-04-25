import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar
} from 'react-simple-wysiwyg';
import { AIChatSession } from './../../utils/ResumeAIModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PROMPT =
  'position titile: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experince level and No JSON array) , give me result in HTML tags';

function RichTextEditor({ onRichTextEditorChange, index, value: propValue }) {
  const [value, setValue] = useState(propValue || '');
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  // Update local state if the parent's prop changes.
  useEffect(() => {
    setValue(propValue || '');
  }, [propValue]);

  const GenerateSummeryFromAI = async () => {
    // Check using the correct field "positionTitle"
    if (!resumeInfo?.experience || !resumeInfo.experience[index]?.positionTitle) {
      toast.error('Please Add Position Title');
      return;
    }
    setLoading(true);
    const promptWithTitle = PROMPT.replace(
      '{positionTitle}',
      resumeInfo.experience[index].positionTitle
    );
    try {
      const result = await AIChatSession.sendMessage(promptWithTitle);
      // Ensure we await the text() response if necessary.
      const text = await result.response.text();
      let parsed;
      let finalValue = "";
      try {
        parsed = JSON.parse(text);
        // Check both "bulletPoints" and "bullet_points"
        const bulletPoints = parsed.bulletPoints || parsed.bullet_points;
        if (bulletPoints && Array.isArray(bulletPoints)) {
          finalValue = `<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`;
        } else if (bulletPoints && typeof bulletPoints === 'string') {
          finalValue = `<ul><li>${bulletPoints}</li></ul>`;
        } else {
          finalValue = text;
        }
      } catch (err) {
        // If JSON parsing fails, just use the raw text.
        finalValue = text;
      }
      setValue(finalValue);
      // Propagate the new HTML value using a synthetic event.
      if (onRichTextEditorChange) {
        onRichTextEditorChange({ target: { value: finalValue } });
      }
    } catch (error) {
      toast.error('Error generating summary from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <button
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border border-primary text-primary px-2 py-1 rounded"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (onRichTextEditorChange) {
              onRichTextEditorChange(e);
            }
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
