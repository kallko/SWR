import React from 'react';
import { useTable } from 'react-table';
import {config} from "../../config/configService";
const baseUrl = config.get('url');

export function ColorUp(props) {
	console.log('PlayerId ', props.playerId);
	const [data, setData] = React.useState([]);
	const [upload, setUpload] = React.useState(false);
	const columns: any = React.useMemo(
		() => [
			{
				Header: 'Unit Name',
				accessor: 'col1' // accessor is the "key" in the data
			},
			{
				Header: 'Slot',
				accessor: 'col2'
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
		console.log('Use Effect ', data.length);
		if (!upload && props.playerId) {
			console.log('Start fetch');
			getColorUpMods().then(() => {});
		}
	}, [data]);

	const getColorUpMods = async () => {
		const url = baseUrl + '/player/colorup/' + props.playerId;
		console.log('GET ', url);
		const dataFromServer = await fetch(url);
		const data = await dataFromServer.json();
		console.log('Received data ', data.result);
		setData(data.result);
		setUpload(true);
	};

	if (upload) {
		return (
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
		);
	} else {
		return (
			<div className="div-right">
				You should input Your ally-code, and wait a little
			</div>
		);
	}
}
