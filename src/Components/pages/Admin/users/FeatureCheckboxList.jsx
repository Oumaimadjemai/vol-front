import React from 'react';
import { Checkbox, FormControlLabel, Divider } from '@mui/material';

const FeatureCheckboxList = ({
  features,
  selectedFeatures,
  onFeatureToggle,
  onSelectAll,
  disabled = false,
  showSelectAll = true,
}) => {
  return (
    <>
      {showSelectAll && (
        <>
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFeatures.length === features.length}
                  indeterminate={selectedFeatures.length > 0 && selectedFeatures.length < features.length}
                  onChange={onSelectAll}
                  disabled={disabled}
                  sx={{
                    color: '#00C0E8',
                    '&.Mui-checked': { color: '#00C0E8' },
                  }}
                />
              }
              label="Sélectionner tout"
            />
          </div>
          <Divider sx={{ mb: 4 }} />
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <FormControlLabel
              key={feature.id}
              control={
                <Checkbox
                  checked={selectedFeatures.includes(feature.id)}
                  onChange={() => onFeatureToggle(feature.id)}
                  disabled={disabled}
                  sx={{
                    color: '#00C0E8',
                    '&.Mui-checked': { color: '#00C0E8' },
                  }}
                />
              }
              label={
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#00C0E8]" />
                  <span className="text-sm">{feature.label}</span>
                </div>
              }
            />
          );
        })}
      </div>
    </>
  );
};

export default FeatureCheckboxList;