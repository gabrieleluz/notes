import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';

import NoteItem from '../../components/NoteItem/NoteItem';
import Modal from '../../ui/Modal/Modal';
import DeleteConfirmation from '../../components/DeleteConfirmation/DeleteConfirmation';

import classes from '../Notebooks/Notebooks.module.css';
import styles from '../../containers/Layout/Layout.module.css';

class Notebook extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      notebookTitle: this.props.location.state.notebook_title,
      submitted: false,
      showModal: false
    }


    this.deleteNotebook = this.deleteNotebook.bind(this);
  }

  componentDidMount() {
    this.props.onGetNotebook(this.props.token, this.props.match.params.id);
  }

  deleteNotebook() {
    this.props.onDeleteNotebook(this.props.token, this.props.match.params.id);

    if(this.props.submitted) {
      this.setState({submitted: true});
    }
  }

  showModal = () => {
    this.setState({showModal: true})
  }

  hideModal = () => {
    this.setState({showModal: false})
  }

  render() {

    let notes = null;

    if(this.props.notebook) {
      notes = this.props.notebook.map(notebook => {
        return(
          <NoteItem
            title={notebook.title}
            key={notebook.id}
            description={notebook.description}
            date={notebook.created_at}
            notebook_id={this.state.id}
            notebook_title={this.state.notebookTitle}
            id={notebook.id} />
          )
      })
    }

    let redirect = <Redirect to="/" />
    if(!this.state.submitted) {
      redirect = null;
    }

    return(
      <div>
        {redirect}
        <div className={classes.Title + " " + styles.Title}>
          <h1>{this.state.notebookTitle}</h1>

          <div className={styles.Links}>
            <Link to={{
              pathname: "/note/new",
              state: {notebook_id: this.state.id,
              notebook_title: this.props.location.state.notebook_title}
              }}
            >
              <button className={styles.Btn}>New Note</button>
            </Link>

            <Link to={{
              pathname: (this.props.match.params.id + "/edit"),
              state: {notebook_id: this.state.id,
              title: this.state.notebookTitle}
              }}>
              <button className={classes.Btn}>Edit</button>
            </Link>

            <button
              className={classes.Btn}
              onClick={this.showModal}>Delete</button>
          </div>

          <Modal show={this.state.showModal} hideModal={this.hideModal}>
            <DeleteConfirmation
              delete={this.deleteNotebook}
              cancel={this.hideModal}
            />
          </Modal>

        </div>

        <div className={classes.Notebooks}>
          {notes}
        </div>
      </div>
      );
}
}

const mapStateToProps = state => {
  return {
    notebook: state.notebook.notes,
    token: state.auth.token,
    submitted: state.note.submitted
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetNotebook: (token, id) => dispatch(actions.notebook(token, id)),
    onDeleteNotebook: (token, id) => dispatch(actions.notebookRemove(id, token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notebook);
