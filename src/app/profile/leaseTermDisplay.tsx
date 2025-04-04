import { LeaseTerms } from "@/src/types";

interface LeaseTermsDisplayProps {
  terms: LeaseTerms;
}

export default function LeaseTermsDisplay({ terms }: LeaseTermsDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if(!terms){
    return (
        <div>no terms</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h5 className="font-medium mb-2">Financial Terms</h5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Monthly Rent</p>
            <p>${terms.financial.rent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Security Deposit</p>
            <p>${terms.financial.deposit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Due Day</p>
            <p>{terms.financial.payment_due_day}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h5 className="font-medium mb-2">Lease Dates</h5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p>{formatDate(terms.dates.start)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p>{formatDate(terms.dates.end)}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h5 className="font-medium mb-2">Utilities</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h6 className="text-sm font-medium mb-1">Included</h6>
            <ul className="space-y-1">
              {terms.utilities.included.map((utility) => (
                <li key={utility} className="text-sm">
                  {utility}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="text-sm font-medium mb-1">Not Included</h6>
            <ul className="space-y-1">
              {terms.utilities.not_included.map((utility) => (
                <li key={utility} className="text-sm">
                  {utility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}