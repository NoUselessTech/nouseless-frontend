import React from 'react';
import { Table } from 'react-bootstrap';

class WebsitesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { websites: []}
        this.updateTable = this.updateTable.bind(this);
        this.insertSite = this.insertSite.bind(this);
        this.deleteSite = this.deleteSite.bind(this);
        this.validateSite = this.validateSite.bind(this);
        this.saveSites = this.saveSites.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.tempBlockSite = this.tempBlockSite.bind(this);
        this.days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    }

    componentDidMount() {
        if (this.state.websites.length === 0) {
            let blockListUrl = 'https://8a85v0qev8.execute-api.us-east-2.amazonaws.com/Production/blocklist'
            fetch(blockListUrl)
                .then(data => data.json())
                .then(info => this.setState(info))
        } else {
            console.log("Fail");
        }
    }

    toggleDetails(event) {
        console.log(event);
        let targetId = event.target.parentNode.id;
        let targetArray = targetId.split('_');
        let index = targetArray[0];

        this.days.map(day => {
            let dayRow = document.getElementById(index + '_' + day);            
            dayRow.style.display = ( dayRow.style.display === '' ? 'none' : '');
            return true;
        })
    }

    tempBlockSite(event) {
        let raw_info = event.target.id;
        let info_array = raw_info.split("_");
        let siteNdx = info_array[0];
        let targetUrl = this.state.websites[siteNdx].url;
        let apiUrl = 'https://8a85v0qev8.execute-api.us-east-2.amazonaws.com/Production/blocksite'
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({"targetSite": targetUrl}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .finally(alert('Site blocked.'))

    }

    checkAll(event) {
        event.stopPropagation();
        let raw_info = event.target.id;
        let info_array = raw_info.split("_");
        let siteNdx = info_array[0];
        let newSites = this.state.websites;

        this.days.map(day => {
            newSites[siteNdx].days[day].map((hour, ndx) => {
                newSites[siteNdx].days[day][ndx] = 1;                
                return true;
            })
            return true;
        })

        this.setState(newSites);
    }

    clearAll(event) {
        event.stopPropagation();
        let raw_info = event.target.id;
        let info_array = raw_info.split("_");
        let siteNdx = info_array[0];
        let newSites = this.state.websites;

        this.days.map(day => {
            newSites[siteNdx].days[day].map((hour, ndx) => {
                newSites[siteNdx].days[day][ndx] = 0;                
                return true;
            })
            return true;
        })

        this.setState(newSites);
    }

    saveSites() {
        fetch('https://8a85v0qev8.execute-api.us-east-2.amazonaws.com/Production/blocklist', {
            method: 'PATCH',
            body: JSON.stringify(this.state.websites),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .finally(alert('Save successful!'))

    }

    insertSite() {
        let siteEntry = document.getElementById('newSiteForm');
        let newUrl = siteEntry.value;
        let newEntry = {
            "url": newUrl,
            "days":
            {
                "MONDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "TUESDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "WEDNESDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "THURSDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "FRIDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "SATURDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                "SUNDAY": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
        }
        let oldSites = this.state.websites;
        oldSites.push(newEntry);
        this.setState(newEntry);

    }

    validateSite(event) {
        let siteValue = event.target.value;
        let siteRegex = /.*\....?/;
        let addSiteBtn = document.getElementById('add_site_btn');
        if (
            siteRegex.test(siteValue) && 
            (this.state.websites.map(site => {return site.url;}).indexOf(siteValue)) === -1 
            ) {

            addSiteBtn.disabled = false;
        } else {
            addSiteBtn.disabled = true;
        }
    }

    deleteSite(event) {
        let raw_info = event.target.id;
        let info_array = raw_info.split("_");
        let siteNdx = info_array[0];
        let newSites = this.state.websites.splice(siteNdx, 1);

        this.setState(newSites);
    }

    updateTable(event) {
        let raw_info = event.target.id;
        let info_array = raw_info.split("_");
        let siteNdx = info_array[0];
        let dayName = info_array[1];
        let hourNdx = info_array[2];
        let oldSites = this.state.websites;

        // Technically, the old != is more concise,
        // But if we use that here, then 1, 0, true, and false all appear in the data
        oldSites[siteNdx].days[dayName][hourNdx] = (
            oldSites[siteNdx].days[dayName][hourNdx] ?
                0 : 1
        );

        this.setState(oldSites);
    }

    render() {
        if (this.state.websites.length === 0) {
            return (
                <>
                    <h1>Loading Blocklist...</h1>
                    <hr />
                    <br />
                    <br />
                    <div style={{
                        width: "100%",
                        position: "fixed",
                        bottom: 0,
                        padding: "1em",
                        backgroundColor: "rgba(255, 255, 255, .5)"
                    }}>
                        <div className="mx-auto">
                            <input className="form-control " type="text" id="newSiteForm" onChange={this.validateSite} style={{width: "300px", display: "inline-block", marginRight: "1em"}} />
                            <button id="add_site_btn" style={{ marginRight: "1em" }} className="btn btn-primary" onClick={this.insertSite}>Add Site</button>
                            <button className="btn btn-success" onClick={this.saveSites}>Save!</button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <h1>Block List</h1>

                    <Table className="table table-striped table-bordered table-light table-hover">
                        <thead style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "rgba(255, 255, 255, .5)"
                        }}>
                            <tr>
                                <th>Site</th>
                                <th>Day</th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                                <th>11</th>
                                <th>12</th>
                                <th>13</th>
                                <th>14</th>
                                <th>15</th>
                                <th>16</th>
                                <th>17</th>
                                <th>18</th>
                                <th>19</th>
                                <th>20</th>
                                <th>21</th>
                                <th>22</th>
                                <th>23</th>
                                <th>24</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.websites.map((site, ndx) => {
                                return (
                                    <>
                                        <tr key={ndx + "_header"} id={ndx + "_header"} onClick={this.toggleDetails}>
                                            <td colSpan="14" key={ndx + "_url_col"}>{site.url}</td>
                                            <td colSpan="3" key={ndx + "_blockNow_col"}><button key={ndx + "_blockNow_btn"} className="btn btn-warning" id={ndx + "_site_blockNow"} onClick={this.tempBlockSite} >Block Now</button></td>
                                            <td colSpan="3" key={ndx + "_checkAll_col"}><button key={ndx + "_checkAll_btn"} className="btn btn-warning" id={ndx + "_site_checkAll"} onClick={this.checkAll} >Check All</button></td>
                                            <td colSpan="3" key={ndx + "_clearAll_col"}><button key={ndx + "_clearAll_btn"} className="btn btn-warning" id={ndx + "_site_clearAll"} onClick={this.clearAll} >Clear All</button></td>
                                            <td colSpan="3" key={ndx + "_delete_col"}><button key={ndx + "_delete_btn"} className="btn btn-danger" id={ndx + "_site_deleteSite"} onClick={this.deleteSite} >Delete</button></td>
                                        </tr>

                                        {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                                            return (
                                                <tr  key={ndx + "_" + day} id={ndx + "_" + day} style={{display: 'none'}}>
                                                    <td key={ndx + "_blank"}></td>
                                                    <td key={ndx + "_label"}>
                                                        {day}
                                                    </td>
                                                    {site.days[day].map((val, subndx) => {
                                                        return (
                                                            <>
                                                                <td key={ndx + "_" + day + "_" + subndx + "_td"}>
                                                                    <input
                                                                        key={ndx + "_" + day + "_" + subndx + "_input"}
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={ndx + "_" + day + "_" + subndx}
                                                                        checked={val ? "checked" : ""}
                                                                        onChange={this.updateTable}
                                                                    />
                                                                </td>
                                                            </>
                                                        )
                                                    })}

                                                </tr>
                                            )
                                        })}

                                    </>
                                )
                            })
                            }
                        </tbody>
                    </Table>
                    <hr />
                    <br />
                    <br />
                    <div style={{
                        width: "100%",
                        position: "fixed",
                        bottom: 0,
                        padding: "1em",
                        backgroundColor: "rgba(255, 255, 255, .5)"
                    }}>
                        <div className="mx-auto">
                            <input className="form-control " type="text" id="newSiteForm" onChange={this.validateSite} style={{width: "300px", display: "inline-block", marginRight: "1em"}} />
                            <button id="add_site_btn" style={{ marginRight: "1em" }} className="btn btn-primary" onClick={this.insertSite}>Add Site</button>
                            <button className="btn btn-success" onClick={this.saveSites}>Save!</button>
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default WebsitesTable;
