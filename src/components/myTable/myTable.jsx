import React from 'react'
import { Table } from 'antd'
import "./myTable.less"
export default class MyTable extends React.Component {
    render() {
        return (
            <div className="myTable">
                <Table
                    pagination={false}
                    columns={this.props.columns}
                    dataSource={this.props.data}
                    rowClassName={(record, index) => index % 2 === 0 ? '' : 'rowclass'}
                    rowKey={record=>record.code}
                    {...this.props.options}
                />
            </div>
        )
    }
}