/**
 * Imports
 */

import {Block, Icon, Table, TableHeader, TableRow, TableCell, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Badge from 'components/Badge'
import getProp from '@f/get-prop'
import fire from 'vdux-fire'

/**
 * <Student Progress/>
 */

export default component({
  render ({props, context}) {
  	const {instances, sequence, studentId, classRef, playlistRef, students} = props
  	const instance = instances[studentId] || {}
  	const {challengeScores = {}, savedChallenges = {}} = instance
  	const backUrl = `/activity/${classRef}/${playlistRef}`
  	const student = students[studentId]

    return (
    	<Block w='col_main' m='auto' bgColor='white' boxShadow='card' mb p>
    		<Block align='start center' mb>
	  			<Button mr='l' px onClick={context.setUrl(backUrl)}>
	  				<Icon name='arrow_back' fs='s' mr='s'/>
	  				Back
	  			</Button>
	  			<Block fs='s' lighter>
	  				{student.displayName}
	  			</Block>
  			</Block>
    		<Table wide>
	    		<TableRow borderBottom='1px solid divider' bgColor='grey' color='white' fs='s'>
	    			<TableHeader lighter p textAlign='left'>
	    				Title
	    			</TableHeader>
	    			<TableHeader w='25%' lighter p textAlign='left'>
	    				Stretch
	    			</TableHeader>
	    			<TableHeader w='25%' lighter p textAlign='left'>
	    				Completed
	    			</TableHeader>
	    			<TableHeader lighter p textAlign='left' />
	    		</TableRow>
	    		{
	    			sequence.map((val, key) =>
	    				<Row
	    					instanceRef={instance.key}
	    					playlistRef={playlistRef}
	    					key={savedChallenges[val] || key}
	    					savedRef={savedChallenges[val]}
	    					completed={challengeScores[val]}
	    					ref={val}
	    					i={key} />
  					)
	    		}
    		</Table>
    	</Block>
    )
  }
})

const Row = fire(({ref, savedRef}) => ({
	game: `/games/${ref}[once]`,
	saved: `/saved/${savedRef}/meta`
}))(component({
	render({props, children}) {
		const {completed, i, game, saved = {}, instanceRef, playlistRef} = props

		if(!game || game.loading || saved.loading) return <span/>

		const {value} = game
		const {value: savedValue} = saved
		const img = value.imageUrl || '/animalImages/teacherBot.png'
		const imgUrl = img.indexOf('/animalImages') === -1
				? img
				: 'https://www.pixelbots.io/' + img

		const stretchType = (value.stretch || {}).type
	  const count = getProp(`badges.${stretchType}`, savedValue) || 0

		return (
			<TableRow border='1px solid divider' borderTopWidth={0}>
				<TableCell p>
					<Block align='start center'>
						<Image sq={50} mr src={imgUrl} outline='1px solid #EEE' outlineOffset='-1px' />
						{
						// <Circle size='32' bg='#AAA' mr>
						// 	{i + 1}
						// </Circle>
						}
						{value.title}
					</Block>
				</TableCell>
				<TableCell p>
					<Block align='start center'>
        		<Badge type={stretchType} size={32} hideTitle effects={false} count={count || 0} description={false} />
      		</Block>
				</TableCell>
				<TableCell p>
					{
						completed &&
							<Circle size={26} bg='green'>
								<Icon name='check' fs='s'/>
							</Circle>
					}
				</TableCell>
				<TableCell p textAlign='right'>
					<a target='_blank' href={`https://www.pixelbots.io/playlist/${playlistRef}/play/${instanceRef}/${i}`}>
						<Button px='m'>View</Button>
					</a>
				</TableCell>
			</TableRow>
		)
	}
}))

const Circle = component({
	render({props, children}) {
		const {size = 32, ...rest} = props
		return (
			<Block color='white' bg='blue' align='center center' fs='xs' circle={size} {...rest}>
				{children}
			</Block>
		)
	}
})
