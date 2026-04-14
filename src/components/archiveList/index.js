import { LitElement, html, unsafeCSS } from "lit";
import { timeTransform } from "@/utils/timeTransform.js";

import StyleInline from "./style.css?inline";
import FormStyleInline from "./form.css?inline";
import MdListStyleInline from "@/assets/style/mdList.css?inline";

import articleList from '@/assets/mdInfo.json'

const searchIconLight = `data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='24'%20height='24'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M21%2038C30.3888%2038%2038%2030.3888%2038%2021C38%2011.6112%2030.3888%204%2021%204C11.6112%204%204%2011.6112%204%2021C4%2030.3888%2011.6112%2038%2021%2038Z'%20fill='none'%20stroke='%23000000'%20stroke-width='4'%20stroke-linejoin='round'/%3e%3cpath%20d='M26.657%2014.3431C25.2093%2012.8954%2023.2093%2012%2021.0001%2012C18.791%2012%2016.791%2012.8954%2015.3433%2014.3431'%20stroke='%23000000'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M33.2216%2033.2217L41.7069%2041.707'%20stroke='%23000000'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e`;

const searchIconDark = `data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='24'%20height='24'%20viewBox='0%200%2048%2048'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M21%2038C30.3888%2038%2038%2030.3888%2038%2021C38%2011.6112%2030.3888%204%2021%204C11.6112%204%204%2011.6112%204%2021C4%2030.3888%2011.6112%2038%2021%2038Z'%20fill='none'%20stroke='%23ffffff'%20stroke-width='4'%20stroke-linejoin='round'/%3e%3cpath%20d='M26.657%2014.3431C25.2093%2012.8954%2023.2093%2012%2021.0001%2012C18.791%2012%2016.791%2012.8954%2015.3433%2014.3431'%20stroke='%23ffffff'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M33.2216%2033.2217L41.7069%2041.707'%20stroke='%23ffffff'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e`;

class ArchiveList extends LitElement {
  static properties = {
    viewList: { type: Array },
    yearList: { type: Array },
    monthList: { type: Array },
    activeYear: { type: Number },
    yearClassResult: { type: Object },
    typeClassResult: { type: Set },
  };

  constructor() {
    super();
    this.yearClassResult = {};
    this.viewList = articleList;
    this.yearList = [];
    this.monthList = [];
    this.activeYear = 0;
    this.typeClassResult = new Set();

    this._initGrid();
    this._updateTypeList(articleList);
  }

  _initGrid() {
    let minYear = new Date(
      articleList[articleList.length - 1].birthTime,
    ).getFullYear();
    let maxYear = new Date().getFullYear();

    this.activeYear = maxYear;

    let yearInfo = {};

    for (let year = maxYear; year >= minYear; year--) {
      this.yearList.push(year);
      this.yearClassResult[year] = Array(371).fill(null);

      let firstDay = new Date(year, 0, 1);
      let firstDayOfWeek = firstDay.getDay();

      yearInfo[year] = {
        firstDayTimestamp: firstDay.getTime(),
        firstDayOfWeek: firstDayOfWeek,
      };
    }

    let now = new Date();
    let dayOfWeek = now.getDay();

    this.yearClassResult[maxYear] = this.yearClassResult[maxYear].slice(
      0,
      this.yearClassResult[maxYear].length - (7 - (dayOfWeek + 1)),
    );

    articleList.forEach((article) => {
      let year = new Date(article.birthTime).getFullYear();
      let { firstDayTimestamp, firstDayOfWeek } = yearInfo[year];
      let dayOffset = article.birthTime - firstDayTimestamp;
      let cellIndex =
        Math.floor(dayOffset / (1000 * 60 * 60 * 24)) + firstDayOfWeek;

      this.yearClassResult[year][cellIndex] = [
        ...(this.yearClassResult[year][cellIndex] || []),
        article,
      ];
    });

    let currentDayOffset = Math.ceil(
      (now.getTime() - yearInfo[maxYear].firstDayTimestamp) /
        (1000 * 60 * 60 * 24),
    );
    let { firstDayOfWeek } = yearInfo[maxYear];
    let prevYearCells =
      this.yearClassResult[maxYear].length - currentDayOffset - firstDayOfWeek;

    let prevYearArr = this.yearClassResult[maxYear - 1] || Array(371);
    let prevYearTail = prevYearArr.slice(
      prevYearArr.length - currentDayOffset + firstDayOfWeek,
    );

    this.yearClassResult[maxYear] = this.yearClassResult[maxYear].slice(
      0,
      currentDayOffset + firstDayOfWeek,
    );
    this.yearClassResult[maxYear] = [
      ...prevYearTail,
      ...this.yearClassResult[maxYear],
    ];

    let currentMonth = now.getMonth() + 1;
    this.monthList = Array(12)
      .fill(0)
      .map((_, index) => ((index + currentMonth) % 12) + 1);
  }

  _updateTypeList(list) {
    this.typeClassResult = new Set();
    list.forEach((item) => {
      item.type.split(`/`).reduce((acc, part) => {
        this.typeClassResult.add(acc + part + `/`);
        return acc + part + `/`;
      }, ``);
    });
  }

  _updateActiveYear(year) {
    this.activeYear = year;
    this.monthList = Array(12)
      .fill(0)
      .map((_, index) => index + 1);
  }

  _updateViewList(year, index) {
    this.viewList = this.yearClassResult[year][index] || [];
    console.log(this.yearClassResult[year][index]);
    this._updateTypeList(this.viewList);
  }

  render() {
    return html`
      <div>
        <div class="activity-container">
          <h2>活力表</h2>
          <div class="grid-container">
            <div class="grid-header-wrapper">
              <div class="grid-header">
                <div class="scroll-container">
                  ${this.yearList.map(
                    (year) => html`<div
                        @click=${() => this._updateActiveYear(year)}
                        class="year-btn ${this.activeYear === year ? `active` : ``}"
                      >
                        ${year}
                      </div>`,
                  )}
                </div>
              </div>
            </div>
            <div class="grid-body">
              <div class="grid-body-header">
                ${this.monthList.map((month) => html`<span>${month}</span>`)}
              </div>
              <div class="grid-body-content-wrapper">
                <div class="grid-body-aside">
                  <span>日</span>
                  <span>二</span>
                  <span>四</span>
                  <span>六</span>
                </div>
                <div class="grid-body-content">
                  ${(this.yearClassResult[this.activeYear] || []).map(
                    (cell, index) =>
                      cell
                        ? html`<div
                            class="grid-item color-${Math.ceil(
                              cell.length / 3,
                            )}"
                            @click=${() =>
                              this._updateViewList(this.activeYear, index)}
                            data-date="${new Date(
                              cell[0].birthTime,
                            ).toLocaleDateString()}"
                            data-activity="${cell.length}"
                          ></div>`
                        : html`<div class="grid-item"></div>`,
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2>归档</h2>

        <div class="control-panel">
          <select>
            <option value="all">全部</option>
            ${[...this.typeClassResult].map(
              (type) => html`<option value="${type}">${type}</option>`,
            )}
          </select>

          <form>
            <input type="text" placeholder="搜索" />
            <button type="submit">
              <img class="light" src="${searchIconLight}" alt="search" />
              <img class="dark" src="${searchIconDark}" alt="search" />
            </button>
          </form>
        </div>

        <ul class="list">
          ${this.viewList.map(
            (item) =>
              html`<li>
                <a href=${item.type + `/` + item.baseName}>
                  <span class="dir">[ ${item.type} ]</span>
                  <span class="basename">${item.baseName}</span>
                  <span class="birthtime">${timeTransform(item.birthTime)}</span>
                  <div class="arrow">
                    <img class="light" src="/arrow-left-up.svg" alt="" />
                    <img class="dark" src="/arrow-left-up-light.svg" alt="" />
                  </div>
                </a>
              </li>`,
          )}
        </ul>
      </div>
    `;
  }

  static styles = unsafeCSS(StyleInline + MdListStyleInline + FormStyleInline);
}

window.customElements.define(`archive-list`, ArchiveList);
