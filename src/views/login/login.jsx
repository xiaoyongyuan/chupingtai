import React from 'react';
import { Form, Input, Button, message } from 'antd';
import "./login.less"
import { HttpLogin } from '../../server/login'
import { LOGIN } from "../../config/apiConfig"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import md5 from 'js-md5'
export default class Login extends React.Component {
    state = {
        loading: false
    }
    componentDidMount = () => {
        sessionStorage.clear()
    }
    onSubmit = (values) => {
        this.setState({
            loading: true
        })
        if (values.username && values.password) {
            let password = md5(values.password)
            HttpLogin(LOGIN, { account: values.username, password }).then(res => {
                if (res.success == 1) {
                    this.setState({
                        loading: false
                    })
                    sessionStorage.setItem('token', res.token);
                    sessionStorage.setItem('alarm', JSON.stringify({ alarmColor: res.alarmcolor, alarmInfo: res.alarminfo }));
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    sessionStorage.setItem('power', JSON.stringify(res.power));
                    if(res.picpath.search('http') == -1){
                        res.picpath = 'http://' + res.picpath
                    }
                    sessionStorage.setItem('picpath',res.picpath);
                    this.props.history.push("/overview");
                } else {
                    message.warning(res.errorinfo);
                    this.setState({
                        loading: false
                    })
                }
            }).catch(()=>{
                this.setState({
                    loading: false
                })
            })
        }
    }
    render() {
        let layout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
        };
        let center = {
            wrapperCol: {
                span: 21,
            }
        }
        return (
            <div className='loginWrap'>
                <div className='formWrap'>
                    <div className='formTitle'>
                        <p className='hello'>你好！</p>
                        <p className='welcome'>欢迎登录明厨亮灶AI分析系统！</p>
                    </div>
                    <Form
                        {...layout}
                        name="basic"
                        hideRequiredMark={true}
                        onFinish={this.onSubmit}
                    >
                        <Form.Item
                            label=""
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的用户名',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined style={{ color: '#cccccc',fontSize:'26px' }} />} placeholder='请输入用户名' className='inputWrap' />
                        </Form.Item>

                        <Form.Item
                            label=""
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的密码',
                                },
                            ]}
                        >
                            <Input.Password visibilityToggle={false} className='inputWrap' prefix={<LockOutlined style={{ color: '#cccccc',fontSize:'26px' }} />} placeholder='请输入密码' />
                        </Form.Item>
                        <Form.Item style={{textAlign:'right'}} {...center}>
                            <Button type="primary" loading={this.state.loading} htmlType="submit" className='btn'>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div >

        )
    }
}