/*
 * Copyright (C) 2019 Sylvain Afchain
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as React from "react"
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import { TableDataViewer } from './TableDataViewer'
import { TableDataNormalizer, Result } from './TableDataNormalizer'

interface Props {
    title: string
    data: any
    classes: any
    defaultExpanded?: boolean
    normalizer?: (data: any) => any
    flatten?: boolean
}

interface State {
    isExpanded: boolean
    data: Result
}

export class DataViewer extends React.PureComponent<Props, State> {

    state: State

    constructor(props) {
        super(props)

        this.state = {
            isExpanded: props.defaultExpanded,
            data: DataViewer.normalizeData(props.data, props.normalizer)
        }
    }

    static normalizeData(data: any, normalizer?: (data: any) => any): Result {
        var dataNormalizer = new TableDataNormalizer(normalizer)

        return dataNormalizer.normalize(data)
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isExpanded) {
            return {
                data: DataViewer.normalizeData(props.data, props.normalizer)
            }
        }
        return null
    }

    onExpandChange(event: object, expanded: boolean) {
        if (expanded) {
            this.setState({ data: DataViewer.normalizeData(this.props.data, this.props.normalizer), isExpanded: expanded })
        } else {
            this.setState({ isExpanded: expanded })
        }
    }

    componentDidMount() {
        console.log(this.props.title)
    }

    render() {
        const { classes } = this.props

        return (
            <ExpansionPanel defaultExpanded={this.props.defaultExpanded} onChange={this.onExpandChange.bind(this)}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography className={classes.heading}>{this.props.title}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {
                        this.state.data.rows.length && this.state.isExpanded &&
                        <TableDataViewer columns={this.state.data.columns} data={this.state.data.rows} />
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}