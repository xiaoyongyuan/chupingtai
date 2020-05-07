import React from 'react';
import "./patrolSettings.less";
import { Form, Select, Button, Input, DatePicker, Breadcrumb } from 'antd';
import moment from "moment";
const Option = Select.Option;
class PatrolSettings extends React.Component {
    formRef = React.createRef();
    formRef1 = React.createRef();
    state = {
        options: ["50%", "55%", "60%", "65%", "70%", "75%", "80%", '85%', '90%', '95%', '100%'],
        options2: ['100%', "200%", '300%'],
        patroShow: false,//判断修改频率选择、修改生效月份显示隐藏
        eidContent: "修改",//取消修改、修改的按钮文字
        sureBtn: false,//控制确认删除和删除确认按钮的显示隐藏
    };
    onFinish = (values) => {
        let date = values.date.format('YYYY-MM');
        date += '-01 00:00:00'
        this.formRef.current.setFieldsValue({ date: moment(date) })
        this.setState({
            sureBtn: true,
            eidContent: "修改"
        });
        //console.log(values,111,values.date.format("YYYY-MM-DD HH:mm:ss"));
    };
    onFinish1 = (values) => {
        //console.log(values,222);
    };
    hanldPatroEdit = () => {
        if (this.state.patroShow) {
            this.setState({
                patroShow: false,
                eidContent: "修改",
            })

        } else {
            this.setState({
                patroShow: true,
                sureBtn: false,
                eidContent: "取消修改"
            })
        }
    };
    hanldPatroDel = () => {
        this.setState({
            patroShow: false
        })
    };
    renderDisabledDate = (current) => {
        if (parseInt(moment().format('DD')) > 15) {
            return current && current < moment().add(1, 'months');
        } else {
            return current && current < moment().add(2, 'months');
        }
    }
    render() {
        const layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 8 },
        };
        const tailLayout = {
            wrapperCol: { offset: 14, span: 2 },
        };
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>巡检设置</Breadcrumb.Item>
                </Breadcrumb>
                <div className="patrolSettings">

                    <div className="patrolLeft">
                        <div className="patro-title">巡查频率设置</div>
                        <div className="frequency">
                            {/*修改  取消修改*/}
                            <Button type="primary" className="frequencyBtn" onClick={this.hanldPatroEdit}>{this.state.eidContent}</Button>
                            <Form
                                {...layout}
                                ref={this.formRef}
                                initialValues={{ month: '100%', frequency: "100%" }}
                                onFinish={this.onFinish}
                                hideRequiredMark
                            >
                                <Form.Item
                                    label="本月巡查频率"
                                    name="month"
                                >
                                    <Input />
                                </Form.Item>
                                {
                                    this.state.patroShow ?
                                        (!this.state.sureBtn ?
                                            <div style={{ marginTop: "55px" }}>
                                                <Form.Item
                                                    label="修改频率选择"
                                                    name="frequency"
                                                >
                                                    <Select >
                                                        {
                                                            this.state.options2.map((item) => (
                                                                <Option value={item} key={item}>{item}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="修改生效月份"
                                                    name="date"
                                                    rules={[{ required: true, message: '生效月份不能为空' }]}
                                                >
                                                    <DatePicker
                                                        picker="month"
                                                        disabledDate={this.renderDisabledDate}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>
                                                <Form.Item {...tailLayout} className="sureBtn">
                                                    <Button type="primary" htmlType="submit">
                                                        确定修改
                                                    </Button>
                                                </Form.Item>
                                            </div> :
                                            <div style={{ marginTop: "55px" }}>
                                                <Form.Item
                                                    label="修改后巡查频率"
                                                    name="frequency"
                                                >
                                                    <Select disabled>
                                                        {
                                                            this.state.options2.map((item) => (
                                                                <Option value={item} key={item}>{item}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="修改后生效日期"
                                                    name="date"
                                                >
                                                    <DatePicker
                                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                                        disabled
                                                        disabledDate={this.renderDisabledDate}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>
                                                <Form.Item {...tailLayout} className="cancelBtn">
                                                    <Button onClick={this.hanldPatroDel}>删除修改</Button>
                                                </Form.Item>
                                            </div>)
                                        : ""
                                }
                            </Form>
                        </div>
                        <div className="remind">
                            <p className="remind-title">提醒：</p>
                            <p className="remind-context">1.修改巡查频率在当月15日23:59:59前进行调整，生效日期可选次月。</p>
                            <p className="remind-context">2.超过15日调整巡查频率，生效日期只能从下下月提供选择。</p>
                            <p className="remind-context">3.修改生效月份提供12月份时间选着。</p>
                            <p className="remind-context">4.多次修改将以最后一次为准。</p>
                        </div>
                    </div>
                    <div className="patrolRight">
                        <div className="patro-title">AI算法阀值设置</div>
                        <Form
                            {...layout}
                            ref={this.formRef1}
                            name="basic"
                            initialValues={{ mask: "50%", hat: '50%', glove: '50%', cigarette: '50%', hygiene: '50%' }}
                            onFinish={this.onFinish1}
                        >
                            <Form.Item
                                label="无口罩检测"
                                name="mask"
                            >
                                <Select >
                                    {
                                        this.state.options.map((item) => (
                                            <Option value={item} key={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="无帽子检测"
                                name="hat"
                            >
                                <Select >
                                    {
                                        this.state.options.map((item) => (
                                            <Option value={item} key={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="无手套检测"
                                name="glove"
                            >
                                <Select >
                                    {
                                        this.state.options.map((item) => (
                                            <Option value={item} key={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="无香烟检测"
                                name="cigarette"
                            >
                                <Select >
                                    {
                                        this.state.options.map((item) => (
                                            <Option value={item} key={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="环境卫生(差)"
                                name="hygiene"
                            >
                                <Select >
                                    {
                                        this.state.options.map((item) => (
                                            <Option value={item} key={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div >
        )
    }
}

export default PatrolSettings;