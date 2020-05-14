import React from "react";
import {useTable} from "react-table";
import underConstruction from "../../img/UnderConstruction.jpg";

export function ColorUp() {
    const [colorUpMods, setcolorUpMods] = React.useState('');
    const [data, setData] = React.useState([]);
    const columns: any = React.useMemo(
        () => [
            {
                Header: 'Unit Name',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: 'Slot',
                accessor: 'col2',
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
        if (!colorUpMods) {
            getColorUpMods().then(() =>{});
        }
    }, [colorUpMods]);

    const getColorUpMods = async () => {
        const data2 = await fetch("http://localhost:1976/mods/colorup");
        const serverStartTime = await data2.json();
        console.log('Received data ', serverStartTime);
        setcolorUpMods(serverStartTime.result[0].character);
        setData(serverStartTime.result);
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
        return (<div className="div-right">
            <img src={underConstruction} alt="logo" width="60%"/>
        </div>)
    }
}
