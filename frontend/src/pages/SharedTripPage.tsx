import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { TravelGuide } from '../types';
import { TravelGuideView } from '../components/TravelGuide/TravelGuideView';
import { useTripStore } from '../stores/useTripStore';

export const SharedTripPage: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const { setCurrentGuide, setCurrentTrip } = useTripStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareCode) return;
    api.getSharedTrip(shareCode)
      .then((res) => {
        setCurrentTrip(res.trip);
        setCurrentGuide(res.itinerary);
        setLoading(false);
      })
      .catch(() => {
        setError('Shared trip not found or link has expired.');
        setLoading(false);
      });
  }, [shareCode]);

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading shared travel guide...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-rose-400">{error}</div>;
  }

  return <TravelGuideView />;
};
