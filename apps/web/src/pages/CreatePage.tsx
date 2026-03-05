import { useNavigate } from 'react-router-dom';
import { CompanyNameInput } from '@/components/CompanyNameInput';

export default function CreatePage() {
  const navigate = useNavigate();

  const handleGenerate = (name: string) => {
    navigate('/create/results', { state: { companyName: name } });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Create Your Logo</h1>
        <p className="text-muted-foreground text-lg">
          Enter your company name and we'll generate endless logo variations
          for you to browse and customize.
        </p>
        <div className="flex justify-center">
          <CompanyNameInput onGenerate={handleGenerate} isGenerating={false} />
        </div>
      </div>
    </div>
  );
}
