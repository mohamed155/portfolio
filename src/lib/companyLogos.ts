// Maps a Role's `company` string (see roles.ts) to a brand mark. Each file
// is a solid-black glyph on a transparent PNG — CompanyLogo paints it with
// the theme accent via CSS mask rather than rendering the pixels directly.
// Any company with no entry here falls back to CompanyLogo's letter-mark.
import espace from '../assets/logos/espace.png?url';
import intouch from '../assets/logos/intouch.png?url';
import governanceHouse from '../assets/logos/governancehouse.png?url';
import urwave from '../assets/logos/urwave.png?url';
import optus from '../assets/logos/optus.png?url';
import meetsUpEvents from '../assets/logos/meetsupevents.png?url';
import salamSoftware from '../assets/logos/salamsoftware.png?url';
import volcanoAgency from '../assets/logos/volcano-agency.png?url';
import upwork from '../assets/logos/upwork.png?url';
import flyfoxSoftware from '../assets/logos/flyfox.png?url';
import irondot from '../assets/logos/irondot.png?url';

export const COMPANY_LOGOS: Record<string, string> = {
  'eSpace / Crealogix': espace,
  'Intouch.com': intouch,
  'Governance House': governanceHouse,
  'UrWave Solutions': urwave,
  Optus: optus,
  'Meets Up Events': meetsUpEvents,
  'Salam Software': salamSoftware,
  'Volcano Agency': volcanoAgency,
  Upwork: upwork,
  'FLYFOX Software': flyfoxSoftware,
  IronDoT: irondot,
};
