// components/CustomSelect.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const [dropdownDirection, setDropdownDirection] = useState('down');

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 300) {
        setDropdownDirection('up');
      } else {
        setDropdownDirection('down');
      }
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={selectRef}>
      <div onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white cursor-pointer transition-all duration-300 flex items-center justify-between hover:border-[#00C0E8]">
        <span className={value ? 'text-gray-800' : 'text-gray-500'}>
          {value || placeholder || 'Sélectionnez'}
        </span>
        {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownDirection === 'up' ? 20 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownDirection === 'up' ? 20 : -10 }}
            className={`absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden ${dropdownDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
          >
            <div className="p-3 border-b border-gray-100">
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20" autoFocus />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div key={option} onClick={() => { onChange(option); setIsOpen(false); setSearchTerm(''); }}
                    className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-[#00C0E8]/5 hover:to-[#0096b8]/5 ${
                      value === option ? 'bg-gradient-to-r from-[#00C0E8]/10 to-[#0096b8]/10' : ''
                    }`}>
                    <span className="text-gray-700">{option}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">Aucun résultat trouvé</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};