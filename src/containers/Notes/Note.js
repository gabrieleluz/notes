import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';

import Modal from '../../ui/Modal/Modal';
import DeleteConfirmation from '../../components/DeleteConfirmation/DeleteConfirmation';

import classes from '../../containers/Layout/Layout.module.css';
import styles from './Note.module.css';

class Note extends Component {

  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      showModal: false
    }

    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidMount() {
    this.props.onGetNote(this.props.token, this.props.match.params.id);
  }

  deleteNote() {
    this.props.onDeleteNote(this.props.token, this.props.match.params.id);

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

    let note = null;

    if(this.props.note) {
      note = (
        <div>
          <div className={classes.Title}>
            <h1>{this.props.note.title}</h1>

            <div className={classes.Links}>
            <Link to={{
                      pathname: (this.props.match.params.id + "/edit"),
                      state: { notebook_id: this.props.location.state.notebook_id,
                               title: this.props.location.state.title,
                               notebook_title: this.props.location.state.notebook_title,
                               note: this.props.note }
              }}>
              <button className={classes.Btn}>Edit</button>
            </Link>

            <button
              onClick={this.showModal}>Delete</button>
          </div>

          <Modal show={this.state.showModal} hideModal={this.hideModal}>
            <DeleteConfirmation
              delete={this.deleteNote}
              cancel={this.hideModal}
            />
          </Modal>

          </div>

          <div className={styles.Content}>
            <div className={styles.Description}>
              <p>{this.props.note.description}</p>
            </div>
          </div>
        </div>
        );
    }

    let redirect = <Redirect to="/" />
    if(!this.state.submitted) {
      redirect = null;
    }

    return(
      <div>
        {redirect}
        {note}
      </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    note: state.note.note,
    token: state.auth.token,
    submitted: state.note.submitted
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetNote: (token, id) => dispatch(actions.note(token, id)),
    onDeleteNote: (token, id) => dispatch(actions.remove(id, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Note);
