import FloorplanViewer from './components/floorplan-viewer/index';
import './styles/app.scss';
import DropBay from './components/drop-bay';
import TourPreview from './components/tour-preview';
import reactor from './reactor';
import Panorama from './components/panorama';
import Component from './reactor/component';
import Toolbar from './components/toolbar/toolbar';
import fetchTour from './services/fetchTour';
import SaveButton from './components/save-button';

export default class DesignStudio extends Component {
  private _detached: HTMLDivElement;
  private floorplanViewer: FloorplanViewer;
  private _dropBay: DropBay;
  private _tourPreview: TourPreview;
  private _toolbar: Toolbar;
  private _saveButton: SaveButton;

  constructor(root: HTMLDivElement, tourToken: string) {
    super(root, 'ev-design-studio');
    reactor.initialize(this);
    this._detached = document.createElement('div');
    this._parent.appendChild(this._detached);
    this._detached.className = 'ev-detached-panoramas';
    this._detached.appendChild(document.createElement('div'));
    reactor.initialize(this);

    this.floorplanViewer = new FloorplanViewer(this._parent, 614);
    this._dropBay = new DropBay(this._parent);
    this._tourPreview = new TourPreview(this._parent);
    this._toolbar = new Toolbar(this._parent);
    this._saveButton = new SaveButton(this._parent);

    fetchTour(tourToken).then(tourData => {
      reactor.populate(tourData);
    });
  }

  public react = (stimulus: any): void => {
    const { dragged } = stimulus;

    while (this._detached.firstChild) {
      this._detached.removeChild(this._detached.firstChild);
    }

    if (dragged) {
      this._detached.appendChild(dragged.html());
    }
  };
}
