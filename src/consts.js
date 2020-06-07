module.exports = {
  // END value signalling that no more data will be passed from this iterator node.
  // Should probably use eof signal or something.
  END: '_!__END__!_',
  ITERATOR_STATUS: {
    NOT_STARTED: 'NOT_STARTED',
    PROCESSING: 'PROCESSING',
    // ^^ There is still more data to be streamed, because this iterator node has
    // not yet received an END value signalling it's child will not provide
    // any more data.
    FINISHED: 'FINISHED',
  }
}
