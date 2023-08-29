import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
function Test() {
    const { Option } = Select;

    const [selectedValue2,setSelectedValue2]=useState(null)

    const typeBareme = [
        'FMSAR', 'AMO', 'CNOPS', 'WAFA1',
        'HP0', 'CHU',
        'HP', 'CHUCNOPS', 'HPCNOPS',
        'SECTMUT',
    ];
    return (
        <>
            <Select
                placeholder="1"
                onChange={()=>setSelectedValue2(null)}

            >
                {typeBareme && typeBareme.map((value, index) => (
                    <Option key={index} value={value}>
                        {value}
                    </Option>
                ))}
            </Select>
            <Select
                placeholder="2"
                value={selectedValue2}
                onChange={(value)=>setSelectedValue2(value)}
            >
                {typeBareme && typeBareme.map((value, index) => (
                    <Option key={index} value={value}>
                        {value}
                    </Option>
                ))}
            </Select>
        </>
    )
}

export default Test