import React, { useState } from 'react';
import { ToolWrapper } from '../components/ToolWrapper';
import { Calculator, Hash, Shield, Zap } from 'lucide-react';

export const BMRCalculator: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('male');
  const [bmr, setBmr] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (gender === 'male') {
      setBmr(Math.round(88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)));
    } else {
      setBmr(Math.round(447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a)));
    }
  };

  return (
    <ToolWrapper
      title="BMR Calculator"
      description="Calculate your Basal Metabolic Rate (BMR)."
      seoText="Find out how many calories your body burns at rest. Essential for planning your diet and fitness goals."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Calculate BMR</button>
        {bmr && (
          <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Your BMR is</div>
            <div className="text-4xl font-black text-slate-900">{bmr} kcal/day</div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const BinaryConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const toBinary = () => setOutput(input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
  const fromBinary = () => {
    try {
      setOutput(input.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join(''));
    } catch {
      setOutput('Invalid Binary');
    }
  };
  return (
    <ToolWrapper
      title="Binary Converter"
      description="Convert text to binary and vice versa."
      seoText="Translate text into binary code or decode binary back into readable text."
    >
      <div className="space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-xl" placeholder="Enter text or binary..." />
        <div className="flex gap-4">
          <button onClick={toBinary} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">To Binary</button>
          <button onClick={fromBinary} className="flex-1 bg-slate-800 text-white py-2 rounded-lg font-bold">From Binary</button>
        </div>
        <textarea value={output} readOnly className="w-full h-32 p-3 border border-slate-300 rounded-xl bg-slate-50" placeholder="Output..." />
      </div>
    </ToolWrapper>
  );
};

export const HexConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const toHex = () => setOutput(input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
  const fromHex = () => {
    try {
      setOutput(input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join(''));
    } catch {
      setOutput('Invalid Hex');
    }
  };
  return (
    <ToolWrapper
      title="Hex Converter"
      description="Convert text to hexadecimal and vice versa."
      seoText="Translate text into hex code or decode hex back into readable text."
    >
      <div className="space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-xl" placeholder="Enter text or hex..." />
        <div className="flex gap-4">
          <button onClick={toHex} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">To Hex</button>
          <button onClick={fromHex} className="flex-1 bg-slate-800 text-white py-2 rounded-lg font-bold">From Hex</button>
        </div>
        <textarea value={output} readOnly className="w-full h-32 p-3 border border-slate-300 rounded-xl bg-slate-50" placeholder="Output..." />
      </div>
    </ToolWrapper>
  );
};
