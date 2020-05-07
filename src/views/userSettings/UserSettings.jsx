import React from 'react';
import { Breadcrumb, Button, Space, Modal, Form, Input, Select, message } from 'antd'
import { EditOutlined, DeleteOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SearchForm from '../../components/myForm/searchForm'
import MyTable from "../../components/myTable/myTable"
import MyPagination from "../../components/myPagination/myPagination"
import { Http } from '../../server/server'
import { USER_LIST, USER_ADD, USER_GETONE, USER_UPDATE, USER_CLEARPWD, USER_DELETE } from '../../config/apiConfig'
const { Option } = Select;
class UserSettings extends React.Component {
    formRef = React.createRef();
    state = {
        pagination: {
            total: 800,
            pageSize: 10,
            current: 1
        },
        search: {}, //搜索参数
        tableData: [],
        showModal: false,  //新增编辑弹窗
        current: '',  //当前操作的数据的code
    }
    searchFormList = [
        {
            type: 'INPUT',
            label: "账号",
            id: 'account',
            placeholder: '请输入账号',
            width: 200,
        },
        {
            type: 'INPUT',
            label: "姓名",
            id: 'realname',
            placeholder: '请输入姓名',
            width: 200,
        },
    ]
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <div className='tableIndex'>{index + 1}</div>,
            width: 80
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
            ellipsis: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
            render: (text, record) => {
                if (JSON.parse(sessionStorage.getItem('power')) && JSON.parse(sessionStorage.getItem('power'))[parseInt(record.userpower)]) {
                    return JSON.parse(sessionStorage.getItem('power'))[parseInt(record.userpower)]
                } else {
                    return ''
                }
            }
        },
        {
            title: '姓名',
            dataIndex: 'realname',
            key: 'realname',
            ellipsis: true,
        },
        {
            title: '邮箱',
            dataIndex: 'emailaddress',
            key: 'emailaddress',
            ellipsis: true,
        },
        {
            title: '电话',
            dataIndex: 'linktel',
            key: 'linktel',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) =>
                <Space size='middle'>
                    <div className='editBtn' title='编辑' onClick={() => { this.showModal(record) }}><EditOutlined /></div>
                    <div className='editBtn' title='重置密码' onClick={() => { this.resetPossword(record.code) }}><ReloadOutlined /></div>
                    {record.userpower == 0 ? null : <div className='deleteBtn' title='删除' onClick={() => { this.delete(record.code) }}><DeleteOutlined /></div>}
                </Space>
        }

    ];
    componentDidMount = () => {
        this.getList()
    }
    getList = () => {
        Http(USER_LIST, { pagesize: this.state.pagination.pageSize, pageindex: this.state.pagination.current, account: this.state.search.account, realname: this.state.search.realname }).then(res => {
            let pagination = {}
            pagination.pageSize = res.pagesize ? parseInt(res.pagesize) : 10;
            pagination.current = res.page ? parseInt(res.page) : 1;
            pagination.total = res.totalcount ? parseInt(res.totalcount) : 0;
            this.setState({
                pagination,
                tableData: res.data
            })
        })
    }
    handleSearch = values => {
        this.setState({
            search: values
        }, () => {
            this.getList()
        })
    }
    paginationChange = pagination => {
        this.setState({
            pagination
        }, () => {
            this.getList()
        })
    }
    showModal = values => {
        if (values == 'add') {
            this.setState({
                current: values,
                showModal: true
            })
        } else {
            Http(USER_GETONE, { account: values.account }).then(res => {
                this.setState({
                    current: values.code,
                    showModal: true
                }, () => {
                    setTimeout(() => {
                        this.formRef.current.setFieldsValue(res.data)
                        this.formRef.current.validateFields()
                    });
                })
            })

        }
    }
    handleModalOk = () => {
        if (this.state.current == 'add') {
            //新增
            this.formRef.current.validateFields().then(values => {
                Http(USER_ADD, values).then(res => {
                    message.success('添加用户成功')
                    this.setState({
                        current: '',
                        showModal: false
                    })
                    this.getList()
                })
            })
        } else {
            //编辑
            this.formRef.current.validateFields().then(values => {
                values.code = this.state.current;
                Http(USER_UPDATE, values).then(res => {
                    message.success('编辑用户成功')
                    this.setState({
                        current: '',
                        showModal: false
                    })
                    this.getList()
                })
            })
        }
    }
    handleModalCancel = () => {
        this.formRef.current.resetFields();
        this.setState({
            showModal: false,
            current: '',
        })
    }
    //重置密码
    resetPossword = code => {
        Http(USER_CLEARPWD, { code }).then(res => {
            if (code == JSON.parse(sessionStorage.getItem('user')).code) {
                message.success('重置密码成功，初始密码为888888,请重新登录')
                this.props.history.push('/')
            } else {
                message.success('重置密码成功，初始密码为888888')
            }
        })
    }
    //删除
    delete = code => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '您确定要删除此用户吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                Http(USER_DELETE, { code }).then(res=>{
                    message.success('删除用户成功');
                    this.getList()
                })
            }
        });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        return (
            <div className='userSettingWrap'>
                <Breadcrumb>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className='mySearchFormWrap'>
                    <SearchForm formList={this.searchFormList} buttonText='搜索' handleSearch={this.handleSearch} />
                    <Button onClick={() => { this.showModal('add') }}>添加用户</Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <MyTable columns={this.columns} data={this.state.tableData} />
                    <MyPagination pagination={this.state.pagination} handlePaginationChange={this.paginationChange} pageSizeOptions={[10, 20, 30, 40]} />
                </div>
                <Modal
                    title={this.state.current == 'add' ? '添加用户' : '编辑用户'}
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form
                        {...formItemLayout}
                        name="changePwd"
                        ref={this.formRef}
                    >
                        <Form.Item
                            name="account"
                            label="账号"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入账号',
                                },
                                {
                                    pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                                    message: "请输入正确的手机号"
                                }
                            ]}
                            hasFeedback
                        >
                            <Input disabled={this.state.current != 'add'} allowClear maxLength={11}/>
                        </Form.Item>
                        <Form.Item
                            name="userpower"
                            label="类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择类型',
                                }
                            ]}
                            hasFeedback
                        >
                            <Select
                                placeholder="请选择类型"
                                allowClear
                            >
                                {JSON.parse(sessionStorage.getItem('power')).map((item, index) => {
                                    return <Option value={index.toString()} key={index}>{item}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="realname"
                            label="真实姓名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入真实姓名',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item
                            name="emailaddress"
                            label="邮箱"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入邮箱',
                                },
                                {
                                    pattern: new RegExp(
                                        "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
                                        "g"
                                    ),
                                    message: `请输入正确的邮箱`
                                }
                            ]}
                            hasFeedback
                        >
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item
                            name="linktel"
                            label="联系电话"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入联系电话',
                                },
                                {
                                    pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                                    message: "请输入正确的手机号！"
                                }
                            ]}
                            hasFeedback
                        >
                            <Input allowClear maxLength={11}/>
                        </Form.Item>
                        <Form.Item
                            name="usergender"
                            label="性别"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择性别',
                                }
                            ]}
                            hasFeedback
                        >
                            <Select
                                placeholder="请选择性别"
                                allowClear
                            >
                                <Option value={"1"}>男</Option>
                                <Option value={"0"}>女</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default UserSettings;