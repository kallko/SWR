import React from "react";
import {useTable} from "react-table";
import underConstruction from "../../img/UnderConstruction.jpg";

export function LegendProgress() {
    const [data, setData] = React.useState([]);
    const columns: any = React.useMemo(
        () => [
            {
                Header: 'Player Name',
                accessor: 'player',
            },
            {
                Header: 'Progress',
                accessor: 'display',
            },
        ],
        [],
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    React.useEffect(() => {

        if (data.length === 0) {
            getLegendProgress().then(() => {});
        }
    }, [data.length]);

    const getLegendProgress = async () => {
        const serverData = await fetch("http://localhost:1976/guild/legendprogress");
        const serverStartTime = await serverData.json();
        // let unitedData = {player: '', display:'Legend KYLO'};
        const unitedData = serverStartTime.result[0]
            .concat({player: '', display:'Legend REY'})
            .concat(serverStartTime.result[1])
        unitedData.unshift({player: '', display: 'Legend Kylo'});
        setData(unitedData);
    };
    if (!!data) {
        return  (
            <table {...getTableProps()} style={{ border: 'solid 1px red', margin: "auto", color: 'white', background: 'black'}} >
                <thead>
                {headerGroups.map((headerGroup: any) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    borderBottom: 'solid 3px red',
                                    background: 'aliceblue',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row: any) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell: any) => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: '10px',
                                            border: 'solid 1px gray',
                                            background: 'black',
                                        }}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    } else {
        return (            <div className="div-right">
            <img src={underConstruction} alt="logo" width="60%"/>
        </div>)
    }

}
