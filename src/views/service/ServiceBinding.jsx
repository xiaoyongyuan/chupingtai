import React from 'react';
import { Breadcrumb, Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MyTable from "../../components/myTable/myTable"
import MyPagination from "../../components/myPagination/myPagination"
class serverSetting extends React.Component {
    state = {
        pagination: {
            total: 800,
            pageSize: 10,
            current: 1
        },
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <div className='tableIndex'>{index + 1}</div>,
            width: 80
        },
        {
            title: '服务器类型',
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,

        },
        {
            title: 'IP',
            dataIndex: 'IP',
            key: 'IP',
            ellipsis: true,
        },
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => <Space>
                <div className='editBtn'><EditOutlined /></div>
                <div className='deleteBtn'><DeleteOutlined /></div>
            </Space>

        }
    ];
    data = [
        {
            key: 1,
            type: '解码服务器',
            name: 'Test001',
            IP: '192.162.1.25',
            port: '16453'
        },
        {
            key: 2,
            type: '解码服务器',
            name: 'Test002',
            IP: '192.162.1.25',
            port: '12453'
        },
        {
            key: 3,
            type: '储存服务器',
            name: 'Test003',
            IP: '192.162.1.25',
            port: '12453'
        },
        {
            key: 4,
            type: '储存服务器',
            name: 'Test004',
            IP: '192.162.1.25',
            port: '12456'
        },
        {
            key: 5,
            type: '分析服务器',
            name: 'Test005',
            IP: '192.162.1.25',
            port: '12454'
        },
        {
            key: 6,
            type: '分析服务器',
            name: 'Test006',
            IP: '192.162.1.25',
            port: '12453'
        },
        {
            key: 7,
            type: '分析服务器',
            name: 'Test007',
            IP: '192.162.1.29',
            port: '12253'
        },
        {
            key: 8,
            type: '分析服务器',
            name: 'Test008',
            IP: '192.162.1.25',
            port: '12453'
        },
        {
            key: 9,
            type: '分析服务器',
            name: 'Test009',
            IP: '192.162.1.27',
            port: '45789'
        },
        {
            key: 10,
            type: '分析服务器',
            name: 'Test010',
            IP: '192.162.1.26',
            port: '45789'
        }
    ]
    paginationChange = pagination => {
        this.setState({
            pagination
        })
    }
    render() {
        return (
            <div className='userSettingWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>服务绑定</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <div style={{width:'100%',textAlign:'right'}}>
                        <Button>添加服务器</Button>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <MyTable columns={this.columns} data={this.data} />
                    <MyPagination pagination={this.state.pagination} handlePaginationChange={this.paginationChange} pageSizeOptions={[10, 20, 30, 40]} />
                </div>
            </div>
        )
    }
}

export default serverSetting;