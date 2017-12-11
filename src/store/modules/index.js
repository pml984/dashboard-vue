import { apiUri } from '../../../config'

import AreaChart from './charts/AreaChart'
import BarChart from './charts/BarChart'
import DataTable from './DataTable'
import LineChart from './charts/LineChart'
import Map from './map/Map'
import PieChart from './charts/PieChart'
import ScatterChart from './charts/ScatterChart'
import SelectField from './SelectField'

const apiModules = {
  alerts: true,
  analytics: {
    getUrl(name, source) {
      return `${apiUri}/sources/${source}/analytics`
    }
  },
  dashboards: true,
  'dashboard-groups': true,
  'dashboard-groups': true,
  fields: {
    getUrl(name, source) {
      return `${apiUri}/sources/${source}/fields`
    }
  }

}


export default {
  AreaChart,
  BarChart,
  DataTable,
  LineChart,
  Map,
  PieChart,
  ScatterChart,
  SelectField
}
