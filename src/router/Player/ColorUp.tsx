import React from 'react';
import { useTable } from 'react-table';
import { config } from '../../config/configService';
const baseUrl = config.get('url');

export function ColorUp(props) {
	const [data, setData] = React.useState([]);
	const [upload, setUpload] = React.useState(false);
	const columns: any = React.useMemo(
		() => [
			{
				Header: 'Unit Name',
				accessor: 'character' // accessor is the "key" in the data
			},
			{
				Header: 'Slot',
				accessor: 'slot'
			}
		],
		[]
	);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({ columns, data });

	React.useEffect(() => {
		if (!upload && props.playerId) {
			getColorUpMods().then(() => {});
		}
	}, [data]);

	const getColorUpMods = async () => {
		const url = baseUrl + '/player/colorup/' + props.playerId;
		const dataFromServer = await fetch(url);
		const data = await dataFromServer.json();
		setData(data.result);
		setUpload(true);
	};

	if (upload && data.length > 0) {
		return (
			<div>
				<table
					{...getTableProps()}
					style={{
						border: 'solid 1px red',
						margin: 'auto',
						color: 'white',
						background: 'black'
					}}
				>
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
											fontWeight: 'bold'
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
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell: any) => {
										return (
											<td
												{...cell.getCellProps()}
												style={{
													padding: '10px',
													border: 'solid 1px gray',
													background: 'black'
												}}
											>
												{cell.render('Cell')}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
				<div>1:square, 2:arrow, 3:romb, 4:triangle, 5:circle, 6:cross</div>
			</div>
		);
	} else {
		if (!props.playerId) {
			return (
				<div className="div-right">
					You should input Your ally-code, and wait a little
				</div>
			);
		} else {
			return (
				<div className="div-right">Everything ok. You shouldn't worry.</div>
			);
		}
	}
}
