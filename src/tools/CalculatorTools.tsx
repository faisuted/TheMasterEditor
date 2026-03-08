import React, { useState } from 'react';
import { ToolWrapper } from '../components/ToolWrapper';
import { Calculator, TrendingUp, Scale, Ruler, Percent, Wallet } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }
    setAge({ years, months, days });
  };

  return (
    <ToolWrapper
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days."
      seoText="Find out exactly how old you are with our precise age calculator. Enter your birth date to see your age in years, months, and days instantly."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Select Birth Date</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button onClick={calculate} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Calculate Age</button>
        {age && (
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <div className="text-2xl font-bold text-indigo-600">{age.years}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Years</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <div className="text-2xl font-bold text-indigo-600">{age.months}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Months</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <div className="text-2xl font-bold text-indigo-600">{age.days}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Days</div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) setBmi(parseFloat((w / (h * h)).toFixed(1)));
  };

  const getStatus = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (val < 25) return { label: 'Normal', color: 'text-green-500' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  return (
    <ToolWrapper
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) instantly."
      seoText="Check your health status with our free BMI calculator. Enter your height and weight to see if you are in a healthy range. 100% private."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 70" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 175" />
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Calculate BMI</button>
        {bmi && (
          <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Your BMI is</div>
            <div className="text-5xl font-black text-slate-900 mb-2">{bmi}</div>
            <div className={`text-lg font-bold ${getStatus(bmi).color}`}>{getStatus(bmi).label}</div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const EMICalculator: React.FC = () => {
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('10');
  const [tenure, setTenure] = useState('12');
  const [emi, setEmi] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);
    if (P && r && n) {
      const val = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(Math.round(val));
    }
  };

  return (
    <ToolWrapper
      title="EMI Calculator"
      description="Calculate your monthly loan installments easily."
      seoText="Plan your finances with our loan EMI calculator. Enter your loan amount, interest rate, and tenure to see your monthly payments instantly."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Loan Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Interest Rate (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tenure (Months)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Calculate EMI</button>
        {emi && (
          <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Your Monthly EMI is</div>
            <div className="text-4xl font-black text-slate-900">₹ {emi.toLocaleString()}</div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const SIPCalculator: React.FC = () => {
  const [amount, setAmount] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const i = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (P && i && n) {
      const val = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      setResult(Math.round(val));
    }
  };

  return (
    <ToolWrapper
      title="SIP Calculator"
      description="Estimate the future value of your Systematic Investment Plan."
      seoText="Plan your wealth creation with our SIP calculator. See how small monthly investments can grow over time with compound interest."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Monthly Investment</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expected Return (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Time Period (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
        <button onClick={calculate} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Calculate Wealth</button>
        {result && (
          <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Estimated Future Value</div>
            <div className="text-4xl font-black text-slate-900">₹ {result.toLocaleString()}</div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const UnitConverter: React.FC = () => {
  const [value, setValue] = useState('1');
  const [type, setType] = useState('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const units: any = {
    length: { m: 1, km: 0.001, cm: 100, mm: 1000, inch: 39.37, ft: 3.281 },
    weight: { kg: 1, g: 1000, mg: 1000000, lb: 2.205, oz: 35.274 },
    temp: { c: 1, f: 33.8, k: 274.15 }
  };
  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return '0';
    if (type === 'temp') {
      if (from === 'c' && to === 'f') return (v * 9/5 + 32).toFixed(2);
      if (from === 'f' && to === 'c') return ((v - 32) * 5/9).toFixed(2);
      return v;
    }
    const base = v / units[type][from];
    return (base * units[type][to]).toFixed(4);
  };
  return (
    <ToolWrapper
      title="Unit Converter"
      description="Convert between different units of length, weight, and temperature."
      seoText="Quickly convert units online. Supports metric and imperial systems for distance, mass, and temperature. Accurate and easy to use."
    >
      <div className="space-y-6">
        <select value={type} onChange={(e) => { setType(e.target.value); setFrom(Object.keys(units[e.target.value])[0]); setTo(Object.keys(units[e.target.value])[1]); }} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temp">Temperature</option>
        </select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">From</label>
            <div className="flex gap-2">
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="p-3 border border-slate-300 rounded-xl outline-none">
                {Object.keys(units[type]).map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">To</label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-600">{convert()}</div>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="p-3 border border-slate-300 rounded-xl outline-none">
                {Object.keys(units[type]).map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const PercentageCalculator: React.FC = () => {
  const [val1, setVal1] = useState('10');
  const [val2, setVal2] = useState('100');
  return (
    <ToolWrapper
      title="Percentage Calculator"
      description="Calculate percentages, increases, and decreases."
      seoText="Find percentages quickly. Calculate what percent one number is of another, or find the value of a percentage."
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-sm text-slate-600">What is</span>
          <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="w-24 p-2 border border-slate-300 rounded-lg outline-none" />
          <span className="text-sm text-slate-600">% of</span>
          <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="w-24 p-2 border border-slate-300 rounded-lg outline-none" />
          <span className="text-sm text-slate-600">?</span>
          <div className="ml-auto font-bold text-indigo-600 text-xl">{(parseFloat(val1) * parseFloat(val2) / 100).toFixed(2)}</div>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState('100');
  const [tip, setTip] = useState('15');
  const [people, setPeople] = useState('1');
  const total = parseFloat(bill) * (1 + parseFloat(tip) / 100);
  return (
    <ToolWrapper
      title="Tip Calculator"
      description="Calculate tips and split bills among friends."
      seoText="Quickly calculate the tip amount and total bill. Split the cost evenly among multiple people."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bill Amount</label>
            <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tip (%)</label>
            <input type="number" value={tip} onChange={(e) => setTip(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">People</label>
            <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 uppercase">Total Bill</div>
            <div className="text-2xl font-bold text-slate-900">₹ {total.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <div className="text-xs text-indigo-500 uppercase">Per Person</div>
            <div className="text-2xl font-bold text-indigo-600">₹ {(total / parseFloat(people)).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
