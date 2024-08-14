import {type Row} from "@/types/row";

const calcEmptyRows = (page:number, rowsPerPage: number, rows: Row[] ) => {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
}
 export default calcEmptyRows
