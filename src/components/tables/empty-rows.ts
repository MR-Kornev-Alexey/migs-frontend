import {type Row} from "@/types/row";
import {SensorInfo} from "@/types/sensor";

const calcEmptyRows = (page: number, rowsPerPage: number, rows: any) => {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
}
 export default calcEmptyRows
