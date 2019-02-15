AV.init('9DGaxKpcWr4342oEznLFc0Lk-gzGzoHsz','xudTYiNIryc6Tuw03Txtrbq4');
var Todo = AV.Object.extend('Todo')

var metaList = document.getElementsByTagName('meta');
for(let item of metaList) {
    if (item.name == 'id') {
        var id = item.content;
        break;
    }
}
fetch("https://www.luogu.org/space/ajax_getuid?username=" + id,{
    headers: new Headers({
        'User-Agent': 'Re: Luogu Todolist'
    }),
    mode: 'no-cors'
})
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        var userId = data.more.uid;
    })
    .catch(function(err) {
        console.error(err);
        var idNotFound = true;
    })

function isAppear(probId) {
    var url = 'https://www.luogu.org/problemnew/show/' + probId;
    fetch(url,{
        headers: new Headers({
            'User-Agent': 'Re: Luogu Todolist'
        }),
        mode: 'no-cors'
    })
        .then(function(res) {
            var ok = res.ok;
        });
    return ok;
}

function addOne(probId) {
    var todo = new Todo();
    todo.set('id',id);
    todo.set('probId',probId);
    todo.set('state','');
    todo.save()
        .then(function() {
            var ok = true;
        },function(err) {
            console.error(err);
            var ok = false;
        });
    return ok;
}

function getOne(probId) {
    var query = new AV.Query('Todo');
    query.equalTo('id',id);
    query.equalTo('probId',probId);
    if(query.find().length < 1) {
        return null;
    }
    return query.find()[0];
}

function deleteOne(probId) {
    var one = getOne(probId);
    if(!one) {
        return false;
    }
    one.destroy()
        .then(function() {
            var ok = true;
        },function(err) {
            console.error(err);
            var ok = false;
        });
    return ok;
}

function getProbName(probId) {
    var url = 'https://www.luogu.org/problemnew/show/' + probId;
    fetch(url,{
        headers: new Headers({
            'User-Agent': 'Re: Luogu Todolist'
        }),
        mode: 'no-cors'
    })
        .then(function(res) {
            return res.text();
        })
        .then(function(data) {
            var probName = data.split('<title> ' + probId + ' ')[1].split(' - 洛谷')[0];
        });
    return probName;
}

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputDisplay: false,
            probId: ''
        };

        this.addHandleClick = this.addHandleClick.bind(this);
        this.inputHandleChange = this.inputHandleChange.bind(this)
        this.inputHandleClick = this.inputHandleClick.bind(this)
    }
    addHandleClick() {
        this.setState({
            inputDisplay: true
        });
    }
    inputHandleChange(e) {
        this.setState({
            probId: e.target.value
        });
    }
    inputHandleClick() {
        this.setState({
            inputDisplay: false
        });
        var probId = this.state.probId;
        if(probId[0] != 'P' && probId[0] != 'U' && probId[0] != 'T') {
            probId = 'P' + probId;
        }
        if(!isAppear(probId)) {
            alert("题目不存在！");
        } else {
            if(addOne(probId)) {
                window.location.reload();
            } else {
                alert("添加失败！");
            }
        }
    }
    render() {
        return (
            <header>
                <h1 className="ui center aligned header"><i className="code icon"></i>Re: Luogu Todolist</h1>
                <div style="float: center; ">
                    <a href="javascript:;" onClick={this.addHandleClick}>
                        <i aria-hidden="true" className="plus icon"></i>
                        <div className="content"> Add</div>
                    </a>
                    <div className="ui input" style={"display" + this.state.inputDisplay ? "inline" : "none"}>
                        <input type="text" placeholder="在此输入题号..." onChange={this.inputHandleChange} />
                        <i aria-hidden="true" className="save circular link icon" onClick={this.inputHandleClick}></i>
                    </div>
                    <a href="https://github.com/Alpha1022/Re-Luogu-Todolist">
                        <i aria-hidden="true" className="github icon"></i>
                        <div className="contet"> GitHub</div>
                    </a>
                </div>
            </header>
        );
    }
}

class Problem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            state: this.props.state
        };

        this.deleteHandleClick = this.deleteHandleClick.bind(this);
        this.starHandleClick = this.starHandleClick.bind(this);
        this.passHandleClick = this.passHandleClick.bind(this);
    }
    deleteHandleClick() {
        if(deleteOne(this.props.probId)) {
            window.location.reload();
        } else {
            alert("删除失败！");
        }
    }
    starHandleClick() {
        var one = getOne(this.props.probId);
        var prevState = one.get('state');
        one.set('state',prevState != 'stared' ? 'stared' : 'none');
        one.save()
            .then(function() {
                this.setState({
                    state: prevState != 'stared' ? 'stared' : 'none'
                })
            },function(err) {
                console.error(err);
                alert('更改失败！');
            });
    }
    passHandleClick() {
        var one = getOne(this.props.probId);
        var prevState = one.get('state');
        one.set('state',prevState != 'passed' ? 'passed' : 'none');
        one.save()
            .then(function() {
                this.setState({
                    state: prevState != 'passed' ? 'passed' : 'none'
                })
            },function(err) {
                console.error(err);
                alert('更改失败！');
            });
    }
    render() {
        return (
            <div role="listitem" className="item">
                <i aria-hidden="true" className={(this.state.state == 'stared' ? 'star' : (this.state.state == 'passed' ? 'check' : 'caret right')) + 'large icon middle aligned'} style={this.state.state &&  'color: ' + (this.state.state == 'stared' ? 'yellow' : 'green') + '; '}></i>
                <div className="content">{this.props.probId + '.' + this.props.probName}</div>
                <span style="float: right; ">
                    <i aria-hidden="true" className="minus circular link" onClick={this.deleteHandleClick}></i>
                    <i aria-hidden="true" className="star circular link" onClick={this.starHandleClick}></i>
                </span>
            </div>
        )
    }
}

function ProblemsList() {
    var query = new AV.Query('Todo');
    query.equalTo('id',id);
    return (
        {query.find().map((todo) => (
            <Problem probId={todo.get('probId')} probName={getProbName(todo.get('probId'))} state={todo.get('state')} />
        ))}
    );
}

if(idNotFound) {
    alert("找不到用户！");
} else {
    ReactDOM.render(
        (
            <Header />
            <div className="ui container">
                <ProblemsList />
            </div>
        ),
        document.body
    );
}