import 'react-testing-library/cleanup-after-each'
import 'jest-dom/extend-expect'

import React from 'react'
import {render} from 'react-testing-library'
import HomePage from '../components/HomePage'

it('renders welcome message', () => {
  const {getByText} = render(<HomePage />)
  expect(getByText('Fig - Let Knowledge Grow.')).toBeInTheDocument()
})
