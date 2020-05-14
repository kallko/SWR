import React from "react";
import {useTable} from "react-table";
import underConstruction from "../../img/UnderConstruction.jpg";
import {dataHelper} from "../../dataHelper/dataHelper";

export function LegendProgress() {
    const [data, setData] = React.useState([]);
    const columns: any = React.useMemo(
        () => [
            {
                Header: 'N',
                accessor: 'index',
            },            {
                Header: 'Player Name',
                accessor: 'player',
            },
            {
                Header: 'Progress',
                accessor: 'display',
            },
        ],
        [],
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    React.useEffect(() => {

        if (data.length === 0) {
            getLegendProgress().then(() => {});
        }
    }, [data.length]);

    const getLegendProgress = async () => {
        let guild: any = await fetch("http://localhost:1976/guild/brazzers");
        guild = await guild.json();
        if (guild.result && guild.result.length > 0) {
            let guildData: any = [];
            for (let i = 0; i < guild.result.length; i++){
                let playerProgress: any = await fetch("http://localhost:1976/player/legendprogress/" + guild.result[i].id);
                playerProgress = await playerProgress.json();
                guildData = guildData.concat([{player: guild.result[i].name, result: playerProgress.result}]);
                let displayData = dataHelper.guildDataunite(guildData);
                await setData(displayData);
            }

        }
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
