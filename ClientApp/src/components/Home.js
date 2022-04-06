import React, { Component } from 'react';
import { ImageComp } from './ImageComp';

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props)
        this.state = {
            imgObjArray: [],
            filteredImgArray: [],
            currIndex: 0,
            filterText: "",
            dropDownValue:"0"
        };

    }
    UniqueArray(currentArray) {
        var a = currentArray;
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].id === a[j].id)
                    a.splice(j--, 1);
            }
        }

        return a;
    };
    handleChangeDropDown(event) {
        //event.target.value
        var dropDownValue = 0;
        if (event.target == null) {
            //not drop down event
            dropDownValue = event;
        } else {
            dropDownValue = event.target.value;
        }
         
        if (dropDownValue == 1) {

            var newFilteredArray = this.state.filteredImgArray.sort(function (a, b) {
                if (a.title > b.title) {
                    return -1;
                }
                if (b.title > a.title) {
                    return 1;
                }
                return 0;
            });
            this.setState({
                filteredImgArray: newFilteredArray,
                dropDownValue: dropDownValue
            });

        } else if (dropDownValue == 2) {

            var newFilteredArray = this.state.filteredImgArray.sort(function (a, b) {
                if (a.title < b.title) {
                    return -1;
                }
                if (b.title < a.title) {
                    return 1;
                }
                return 0;
            });
            this.setState({
                filteredImgArray: newFilteredArray,
                dropDownValue: dropDownValue
            });

        }
    }
    FilterActivate(text) {
        //var newFilterText = this.state.filterText + text;
        //if (text.length == 0) {
        //    this.setState({
        //        imgObjArray: newArray,
        //        filterText: text
        //    });
        //}
        var newArray = this.state.imgObjArray.filter(function (el) {
            return el.title.startsWith(text);
        });
        console.log(newArray);
        this.setState({
            filteredImgArray: newArray,
            filterText: text
        });
    }
    FilterArray(imgObjArray, filterText) {
        var newArray = imgObjArray.filter(function (el) {
            return el.title.startsWith(filterText);
        });
        return newArray;
    }
    isBottom(el) {
        return el.getBoundingClientRect().bottom - 20 <= window.innerHeight;
    }
    trackScrolling = () => {
        const wrappedElement = document.getElementById('maindivid');
        if (this.isBottom(wrappedElement) || wrappedElement.clientHeight < window.innerHeight) {
            console.log('header bottom reached');
            this.fetchImageData(this.state.currIndex, 20);
        }
    };

    fetchImageData(from, itemsPerPage) {
        var ParamsObj = { from: from, itemsPerPage: itemsPerPage };
        var option = {
            method: 'POST',
            body: JSON.stringify(ParamsObj),
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch('/data/page', option).then(response => response.json())
            .then((response) => {
                var status = response.result;
                if (status == "OK") {
                    //var data = JSON.parse(response.data);
                    var newIndex = this.state.currIndex + response.data.length;
                    var newImageArray = this.UniqueArray(this.state.imgObjArray.concat(response.data));
                    var newFilteredArray = this.FilterArray(newImageArray, this.state.filterText);

                    if (newFilteredArray.length == this.state.filteredImgArray.length) {
                        this.trackScrolling();
                    }

                    this.setState({
                        imgObjArray: newImageArray,
                        filteredImgArray: newFilteredArray,
                        currIndex: newIndex
                    });

                    if (this.state.dropDownValue != 0) {
                        this.handleChangeDropDown(this.state.dropDownValue);
                    }

                } else {
                    debugger;

                }
            });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.filteredImgArray.length != this.state.filteredImgArray.length) {
            this.trackScrolling();
        }
    }
    componentDidMount() {
        if (this.state.currIndex == 0) {
            document.addEventListener('scroll', this.trackScrolling);
            this.fetchImageData(0,20);
        }

    }

      render () {
          return (
              <div className="MainContainer" id="maindivid">
                  <div className="InputsMain">
                      <div className="InputsMainInner">
                          <input className="FilterInput InputStyle" placeholder="filter" type="text" id="filterinput" value={this.state.filterText} onChange={e => this.FilterActivate(e.target.value)} />
                          <label className="SortInput">
                              <select className="InputStyle" style={{ marginLeft:"10px" }} value={this.state.dropDownValue} onChange={this.handleChangeDropDown.bind(this)}>
                                  <option value="0">Sort By</option>
                                  <option value="1">Title DESC</option>
                                  <option value="2">Title ASC</option>
                              </select>
                          </label>

                      </div>
                  </div>
                  {this.state.filteredImgArray.map((imgObj, index) => <ImageComp imageData={imgObj} imgObjIndex={imgObj.id}/> )}
               </div>
        );
      }
}
