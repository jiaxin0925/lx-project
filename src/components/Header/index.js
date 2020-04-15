import React, { Component } from 'react';
import { connect, router } from 'dva';
import _ from 'lodash';
import { Row, Col, Select, Button, Switch } from 'antd';
import { FormattedMessage, setLocale } from 'umi-plugin-react/locale';
import headerStyle from './header.scss';
import { extractLocalesData, getCurrencyByRegion } from '@/utils/preferences';
import { storeMain } from '@/utils/storage';
import { FEATURE_NAME } from '@/utils/config';

const { Link } = router;
const { Option } = Select;

const namespace = 'header';

const mapStateToProps = (state) => {
  const { categories, isShowprice, locales, preferences } = state[namespace];
  return {
    categories,
    isShowprice,
    locales,
    preferences
  };
};

@connect(mapStateToProps)
class Header extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: `${namespace}/fetchCategories`,
    // });
    // dispatch({
    //   type: `${namespace}/fetchLocals`,
    // });

    // let showprice = JSON.parse(sessionStorage.getItem(FEATURE_NAME));
    // dispatch({
    //   type: `${namespace}/showPrice`,
    //   payload: showprice
    // });
  }

  handleChange = (value) => {
    const country = value;
    const localesData = extractLocalesData(this.props.locales);
    const countriesData = localesData.countries;
    const countriesToLanguagesData = localesData.countriesToLanguages;
    const countriesToCurrenciesData = localesData.countriesToCurrencies;
    const region = getCurrencyByRegion(value, localesData);
    let defaultLanguage = '';
    let defaultCurrency = '';
    let selectedCountry = _.find(countriesData,{name:country});
   
    _.each(countriesToLanguagesData[selectedCountry.code], (language) => {
      if (language.defaulted) {
        defaultLanguage = language.languageCode;
        return false;
      }
    });

    if (!defaultLanguage && countriesToLanguagesData[selectedCountry.code] && countriesToLanguagesData[selectedCountry.code].length) {
      defaultLanguage = (countriesToLanguagesData[selectedCountry.code][0]).languageCode;
    }

    defaultCurrency = countriesToCurrenciesData[selectedCountry.code] || '';

    let newPreferences = Object.assign({}, {
      region: region,
      country: selectedCountry.code,
      language: defaultLanguage,
      currency: defaultCurrency
    });
    
    this.props.dispatch({
      type: `${namespace}/updatePreferences`,
      payload: newPreferences
    });
    
    this.props.dispatch({
      type: `${namespace}/fetchCategories`,
    });
  }

  handleSwitchChange = (checked) => {
    let { dispatch } = this.props;
    dispatch({
      type: `${namespace}/showPrice`,
      payload: checked
    });
    storeMain(checked);
  }

  render() {
    const { locales, isShowprice } = this.props;
    let defaultValue = !_.isEmpty(locales) ? locales[0].countryName : 'United States';

    return (
      <div className="header">
        <Row>
          <Col span={6}>
          </Col>
          <Col span={1}>
          </Col>
          <Col span={17}>
            <div className="select_language">
              <span style={{ marginRight: 8 }} onClick={()=>setLocale('en-US')}>English</span>
              <span> / </span>
              <span onClick={()=>setLocale('zh-CN')}>Chinese</span>
            </div>
            <div className="header_left">
                <span><FormattedMessage id="Showing products for:" /> </span>
                <Select defaultValue={defaultValue} style={{ width: 160 }} onChange={this.handleChange}>
                  {
                    _.map(locales, (locale, index) => {
                      return <Option value={locale.countryName} key={index}>{locale.countryName}</Option>
                    })
                  }
                </Select>
                {/* <a href={'http://10.251.65.185:18112/api/v1/pricelist'} download={'price-list'} className="pricelist_download">
                    <Button type="primary" icon="download">DCG price list</Button>
                </a> */}
            </div>
            <div className="switch_show_price">
              <FormattedMessage id="Show product price" />
              <Switch size="small" checked={isShowprice} onChange={this.handleSwitchChange} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;
