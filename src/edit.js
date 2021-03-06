import React, {PropTypes} from 'react'
import {ListSubHeader, Button, Input} from 'react-toolbox'

export default function (compDef) {
  const {componentName,
	 fields
	} = compDef
  let propTypes = {}

  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
  const fieldNames = Object.keys(fields)
  fieldNames.map((fieldName)=>{
    if (fields[fieldName].relation) {
      const relation = fields[fieldName].relation
      propTypes[`${relation}Routes`] = PropTypes.object
      propTypes[`${relation}Templates`] = PropTypes.object
      propTypes[relation] = PropTypes.object
    }
  })
  const ComponentEdit = (props) =>{
    let next = Object.assign({}, props[componentName])
    const save = () =>{props[`save${componentProperName}`](next)}
    const store = () =>{props[`store${componentProperName}`](next)}
    const {goBack} = props
    const listCaption = `Ingrese datos de ${componentProperName}`
    const listFields = fieldNames.map((fieldName)=>{
      let label = fields[fieldName].label
      if (!label || label === '') {
	  label = fieldName
	}
      const componentField = compDef.fields[fieldName]
      const fieldError = `${fieldName}Error`
      let error = ''
      if (next[fieldError]) {
	error = <span>{next[fieldError]}</span>
      }
      if (fields[fieldName].relation) {
	const relation = fields[fieldName].relation
	const routes = `${relation}Routes`
	const listRoute = props[routes][`${relation}List`]
	const relationDisplay = props[`${relation}Templates`][`${relation}Display`]
	console.log('this component was selected', relationDisplay, props[relation])
	return <div key={fieldName}>
	  <relationDisplay component={props[relation]}/>
	  <label>{relation}</label>

	  <Button icon='add' onClick={(e) => {
	  props.pushRoute(listRoute)
	}}
	  /></div>
      }
      return <div key={fieldName}>
	<Input value={next[fieldName] ||''}
      type={componentField.uiType} label={label} name='name' icon={componentField.icon}
      hint={componentField.hint}
      onChange={(e) => {
	next[fieldName] = e
	save()
      }}/>
	{error}
      </div>
    })
    return <div>
      <ListSubHeader caption={listCaption}/>
      {listFields}
      <Button icon='done' floating disabled={!next.isValid} accent mini onClick={(e)=>{
	store()
	goBack()
      }}/>
      <Button icon='undo' floating accent mini onClick={()=>{goBack()}}/>
      </div>
  }
  ComponentEdit.propTypes = propTypes
  ComponentEdit.propTypes[`${componentName}`] = PropTypes.object
  ComponentEdit.propTypes[`save${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes[`store${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes.goBack = PropTypes.func
  ComponentEdit.propTypes.pushRoute = PropTypes.func
  return ComponentEdit
}
//create a separate parser
//     for (let fieldName of fieldNames) {
//       if (fields[fieldName].relation) {
// 	const relation = fields[fieldName].relation
// 	console.log('relation:', relation)
//       }
//       let label = fields[fieldName].label
//       if (!label || label === '') {
// 	  label = fieldName
// 	}
//       const componentField = compDef.fields[fieldName]
//       const fieldError = `${fieldName}Error`
//       let error = ''
//       if (next[fieldError]) {
// 	error = <span>{next[fieldError]}</span>
//       }
//       const field = <div key={fieldName}>
// 	    <Input value={next[fieldName] ||''}
//       type={componentField.uiType} label={label} name='name' icon={componentField.icon}
//       hint={componentField.hint}
//       onChange={(e) => {
// 	next[fieldName] = e
// 	save()
//       }}/>
// 	      {error}
//       </div>
// 	listFields.push(field)
//     }
//     return (
