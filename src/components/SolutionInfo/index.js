import React, { PureComponent } from 'react';
import { Button } from 'antd';
import solutionInfoStyle from './SolutionInfo.scss';


class SolutionInfo extends PureComponent {

  render() {
    return (
        <div className={solutionInfoStyle.service_foot}>
            <div className='foot_title'>
            Lenovo Expert Technical Sales (LETS)
            </div>
            <div className='foot_content'>
            The LETS team offer support for Lenovo solutions such as ThinkAgile,
            High Performance Computing, Software Defined Datacenter, VMware vSAN,
            Nutanix and SAP. Whether you are a Lenovo Partner or a Lenovo employee
            LETS can offer technical assistance to help you close sales.

            </div>
            <Button className='foot_btn'>
                Learn more
            </Button>
        </div>
    );
  }
}

export default SolutionInfo;
