// import React from 'react';
// import { formatter } from '../../../Utils/apputils';
// import './orderrow.css';

// export default function OrderRow({ item, removeItem, showAction = true }) {
//     return (
//         <tr> {showAction &&
//             <td>
//                 <div className="order-action">
//                     <div className="orderdelete">
//                         <button className="btn btn-danger" onClick={removeItem.bind(this, item.id)}>
//                             {/* <i className="las la-trash-alt"></i> */}
//                             X
//                         </button>
//                     </div>
//                 </div>
//             </td>}
//             <td>
//                 {item.itemname}
//             </td>
//             <td>
//                 {item.rate}
//             </td>
//             <td>
//                 {item.qty}
//             </td>
//             <td style={{ textAlign: 'end' }}>
//                 {formatter.format(item.rate * item.qty)}
//             </td>
//         </tr>
//     )
// }
