import React from 'react';
import {Text, View} from 'react-native';

import Alert, {DISPLAY_TYPES} from './Alert';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
			hasError: false,
		};
	}

	static getDerivedStateFromError(error) {
		return {
			error,
			hasError: true,
		};
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error,
			errorInfo,
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<View>
					<Alert
						displayType={DISPLAY_TYPES.warning}
						text="Something went wrong."
					/>

					{this.state.error && (
						<Text>{this.state.error.toString()}</Text>
					)}

					{this.state.errorInfo && (
						<Text>{this.state.errorInfo.toString()}</Text>
					)}
				</View>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
