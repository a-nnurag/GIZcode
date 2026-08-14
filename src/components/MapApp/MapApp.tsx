import { useMapStore } from '../../state/mapStore';
import { Sidebar } from '../Sidebar/Sidebar';
import { MapView } from '../MapView/MapView';
import { Legend } from '../Legend/Legend';
import { BlockDetailPanel } from '../BlockDetailPanel/BlockDetailPanel';
import { CompareView } from '../CompareView/CompareView';
import { QuickTourCarousel } from '../QuickTour/QuickTourCarousel';

export function MapApp() {
  const compareActive = useMapStore((s) => s.compareMode.active);

  return (
    <>
      <div className="flex min-h-0 flex-1">
        {compareActive ? (
          <CompareView />
        ) : (
          <>
            <Sidebar />
            <div className="relative min-w-0 flex-1">
              <MapView />
              <div className="absolute bottom-4 right-4 z-10 flex flex-col-reverse items-end gap-3">
                <div className="w-72">
                  <Legend />
                </div>
                <BlockDetailPanel />
              </div>
            </div>
          </>
        )}
      </div>
      <QuickTourCarousel />
    </>
  );
}
