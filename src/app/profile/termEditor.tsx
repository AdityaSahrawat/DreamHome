'use client';

import { LeaseTerms } from '@/src/types';
import { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TermsEditorProps {
  currentTerms: LeaseTerms;
  proposedTerms?: Partial<LeaseTerms>;
  onChange: (terms: Partial<LeaseTerms>) => void;
}

export default function TermsEditor({ 
  currentTerms, 
  proposedTerms = {}, 
  onChange 
}: TermsEditorProps) {
  const [expandedSections, setExpandedSections] = useState({
    financial: true,
    dates: true,
    utilities: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTermChange = (
    section: keyof LeaseTerms,
    field: string,
    value: any
  ) => {
    onChange({
      ...proposedTerms,
      [section]: {
        ...proposedTerms[section],
        [field]: value
      }
    });
  };

  const renderField = (
    section: keyof LeaseTerms,
    field: string,
    label: string,
    type: 'number' | 'text' | 'date' | 'checkbox'
  ) => {
    const sectionData = currentTerms[section] as any;
    const proposedSectionData = proposedTerms[section] as any;
    
    const currentValue = sectionData?.[field];
    const proposedValue = proposedSectionData?.[field] ?? currentValue;
    const isModified = proposedSectionData?.[field] !== undefined && 
                      proposedSectionData?.[field] !== currentValue;

    return (
      <div className="grid grid-cols-12 items-center gap-4 py-2">
        <Label htmlFor={`${section}-${field}`} className="col-span-4">
          {label}
        </Label>
        <div className="col-span-3">
          <div className="text-sm text-gray-500">
            {type === 'date' 
              ? new Date(currentValue).toLocaleDateString() 
              : currentValue}
          </div>
        </div>
        <div className="col-span-5 flex items-center gap-2">
          {type === 'checkbox' ? (
            <Switch
              id={`${section}-${field}`}
              checked={!!proposedValue}
              onCheckedChange={(val) => handleTermChange(section, field, val)}
              className={isModified ? 'bg-primary' : ''}
            />
          ) : (
            <Input
              id={`${section}-${field}`}
              type={type}
              value={proposedValue}
              onChange={(e) => handleTermChange(
                section, 
                field, 
                type === 'number' ? Number(e.target.value) : e.target.value
              )}
              className={cn(
                'w-full',
                isModified && 'border-primary bg-primary/10'
              )}
            />
          )}
        </div>
      </div>
    );
  };

  const renderUtilities = () => {
    const currentIncluded = new Set(currentTerms.utilities.included);
    const proposedIncluded = new Set(
      proposedTerms.utilities?.included || currentTerms.utilities.included
    );
    const proposedExcluded = new Set(
      proposedTerms.utilities?.not_included || currentTerms.utilities.not_included
    );

    const allUtilities = [
      ...currentTerms.utilities.included,
      ...currentTerms.utilities.not_included
    ];

    const handleUtilityChange = (utility: string, included: boolean) => {
      const newIncluded = new Set(proposedIncluded);
      const newExcluded = new Set(proposedExcluded);

      if (included) {
        newIncluded.add(utility);
        newExcluded.delete(utility);
      } else {
        newExcluded.add(utility);
        newIncluded.delete(utility);
      }

      onChange({
        ...proposedTerms,
        utilities: {
          included: Array.from(newIncluded),
          not_included: Array.from(newExcluded)
        }
      });
    };

    return (
      <div className="space-y-2">
        {allUtilities.map((utility) => {
          const isCurrentlyIncluded = currentIncluded.has(utility);
          const isProposedIncluded = proposedIncluded.has(utility);
          const isModified = isProposedIncluded !== isCurrentlyIncluded;

          return (
            <div key={utility} className="grid grid-cols-12 items-center gap-4 py-1">
              <Label className="col-span-4">{utility}</Label>
              <div className="col-span-3">
                <div className="text-sm text-gray-500">
                  {isCurrentlyIncluded ? 'Included' : 'Not Included'}
                </div>
              </div>
              <div className="col-span-5">
                <Switch
                  checked={isProposedIncluded}
                  onCheckedChange={(val) => handleUtilityChange(utility, val)}
                  className={isModified ? 'bg-primary' : ''}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Financial Terms */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('financial')}
        >
          <h3 className="font-medium">Financial Terms</h3>
          {expandedSections.financial ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
        {expandedSections.financial && (
          <div className="p-4 space-y-2">
            {renderField('financial', 'rent', 'Monthly Rent', 'number')}
            {renderField('financial', 'deposit', 'Security Deposit', 'number')}
            {renderField('financial', 'payment_due_day', 'Payment Due Day', 'number')}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('dates')}
        >
          <h3 className="font-medium">Lease Dates</h3>
          {expandedSections.dates ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
        {expandedSections.dates && (
          <div className="p-4 space-y-2">
            {renderField('dates', 'start', 'Start Date', 'date')}
            {renderField('dates', 'end', 'End Date', 'date')}
          </div>
        )}
      </div>

      {/* Utilities */}
      <div className="border rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('utilities')}
        >
          <h3 className="font-medium">Utilities</h3>
          {expandedSections.utilities ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
        {expandedSections.utilities && (
          <div className="p-4">
            {renderUtilities()}
          </div>
        )}
      </div>
    </div>
  );
}