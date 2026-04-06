// components/DatePicker.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MONTHS, WEEK_DAYS } from './constants/flightConstants';

export const DatePicker = ({ value, onChange, placeholder, minDate, maxDate, position = 'auto' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(value ? new Date(value) : new Date());
  const [displayYear, setDisplayYear] = useState(value ? new Date(value).getFullYear() : new Date().getFullYear());
  const [displayMonthIndex, setDisplayMonthIndex] = useState(value ? new Date(value).getMonth() : new Date().getMonth());
  const [mode, setMode] = useState('days');
  const pickerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        setMode('days');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (position === 'top') {
        setDropdownPosition('top');
      } else if (position === 'bottom') {
        setDropdownPosition('bottom');
      } else {
        if (spaceAbove > spaceBelow && spaceAbove > 300) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    }
  }, [isOpen, position]);

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const handleDateSelect = (date) => {
    if (!isDateDisabled(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      onChange(formatted);
      setIsOpen(false);
      setMode('days');
    }
  };

  const handleMonthSelect = (monthIndex) => {
    setDisplayMonthIndex(monthIndex);
    setDisplayMonth(new Date(displayYear, monthIndex, 1));
    setMode('days');
  };

  const handleYearChange = (e) => {
    let year = parseInt(e.target.value);
    if (!isNaN(year)) {
      if (year < 1900) year = 1900;
      if (year > 2100) year = 2100;
      setDisplayYear(year);
      setDisplayMonth(new Date(year, displayMonthIndex, 1));
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const endYear = currentYear + 10;
  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }

  return (
    <div className="relative w-full" ref={pickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-xl px-6 py-3 bg-white cursor-pointer transition-all duration-300 flex items-center justify-between hover:border-[#00C0E8] focus-within:border-[#00C0E8] focus-within:ring-2 focus-within:ring-[#00C0E8]/20"
      >
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400 text-sm" />
          <span className={`text-sm ${value ? 'text-gray-800' : 'text-gray-500'}`}>
            {value ? formatDisplayDate(value) : (placeholder || 'DD/MM/YYYY')}
          </span>
        </div>
        {isOpen ? <FaChevronUp className="text-gray-400 text-sm" /> : <FaChevronDown className="text-gray-400 text-sm" />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden ${
              dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
            style={{ width: '280px' }}
          >
            {mode === 'days' && (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <button onClick={() => {
                    const newMonth = displayMonthIndex - 1;
                    if (newMonth < 0) {
                      setDisplayYear(displayYear - 1);
                      setDisplayMonthIndex(11);
                      setDisplayMonth(new Date(displayYear - 1, 11, 1));
                    } else {
                      setDisplayMonthIndex(newMonth);
                      setDisplayMonth(new Date(displayYear, newMonth, 1));
                    }
                  }} className="p-1 hover:bg-gray-200 rounded-md transition-colors" type="button">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => setMode('months')} className="text-sm font-medium text-gray-700 hover:text-[#00C0E8] transition-colors px-2 py-1 rounded-md">
                      {MONTHS[displayMonthIndex]}
                    </button>
                    <button onClick={() => setMode('years')} className="text-sm font-medium text-gray-700 hover:text-[#00C0E8] transition-colors px-2 py-1 rounded-md">
                      {displayYear}
                    </button>
                  </div>
                  
                  <button onClick={() => {
                    const newMonth = displayMonthIndex + 1;
                    if (newMonth > 11) {
                      setDisplayYear(displayYear + 1);
                      setDisplayMonthIndex(0);
                      setDisplayMonth(new Date(displayYear + 1, 0, 1));
                    } else {
                      setDisplayMonthIndex(newMonth);
                      setDisplayMonth(new Date(displayYear, newMonth, 1));
                    }
                  }} className="p-1 hover:bg-gray-200 rounded-md transition-colors" type="button">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-0 px-2 pt-2">
                  {WEEK_DAYS.map((day, idx) => (
                    <div key={idx} className="text-center text-[10px] font-semibold text-gray-400 py-1">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0 p-2">
                  {getDaysInMonth(displayYear, displayMonthIndex).map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} className="h-8" />;
                    
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = value === dateStr;
                    const isDisabled = isDateDisabled(date);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    
                    return (
                      <button key={dateStr} onClick={() => handleDateSelect(date)} disabled={isDisabled}
                        className={`h-8 w-8 rounded-lg text-xs font-medium transition-all duration-100 flex items-center justify-center mx-auto
                          ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                          ${isSelected ? 'bg-[#00C0E8] text-white shadow-sm' : 'text-gray-700'}
                          ${isToday && !isSelected && !isDisabled ? 'border border-[#00C0E8] text-[#00C0E8] bg-[#00C0E8]/5' : ''}`}
                        type="button">
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100 bg-gray-50">
                  <button onClick={() => handleDateSelect(new Date())} className="text-xs text-[#00C0E8] hover:text-[#0096b8] font-medium transition-colors" type="button">
                    Aujourd'hui
                  </button>
                  {value && (
                    <button onClick={() => { onChange(''); setIsOpen(false); }} className="text-xs text-gray-500 hover:text-red-500 transition-colors" type="button">
                      Effacer
                    </button>
                  )}
                </div>
              </>
            )}

            {mode === 'months' && (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <button onClick={() => setMode('days')} className="p-1 hover:bg-gray-200 rounded-md transition-colors" type="button">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-semibold text-gray-800">{displayYear}</span>
                  <button onClick={() => setMode('years')} className="p-1 hover:bg-gray-200 rounded-md transition-colors" type="button">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 p-2">
                  {MONTHS.map((month, idx) => (
                    <button key={idx} onClick={() => handleMonthSelect(idx)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-100 ${
                        displayMonthIndex === idx ? 'bg-[#00C0E8] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`} type="button">
                      {month}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mode === 'years' && (
              <>
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <button onClick={() => setMode('months')} className="p-1 hover:bg-gray-200 rounded-md transition-colors" type="button">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <input type="number" value={displayYear} onChange={handleYearChange}
                    className="w-16 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#00C0E8] focus:ring-1 focus:ring-[#00C0E8]"
                    min="1900" max="2100" />
                  <div className="w-6"></div>
                </div>
                <div className="grid grid-cols-4 gap-1 p-2 max-h-40 overflow-y-auto">
                  {years.map((year) => (
                    <button key={year} onClick={() => { setDisplayYear(year); setDisplayMonth(new Date(year, displayMonthIndex, 1)); setMode('months'); }}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-100 ${
                        displayYear === year ? 'bg-[#00C0E8] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`} type="button">
                      {year}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};