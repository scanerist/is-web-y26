import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar} from '@vkontakte/vkui';
import {useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import {useState} from 'react';
import vkBridge from '@vkontakte/vk-bridge';

export const Home = ({id, fetchedUser}) => {
    const {photo_200, city, first_name, last_name} = {...fetchedUser};
    const routeNavigator = useRouteNavigator();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRandomImage = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.thecatapi.com/v1/images/search', {
                    headers: {
                        'x-api-key': 'live_deip4zzYKzM7dOOIsm1E0VOQNIInIWMJg5xPxCfs6JZG96aSBsGDiiwDPER76T4i',
                    },
                },
            );
            const data = await response.json();
            return data[0].url;
        } catch (err) {
            setError('Ошибка при получении изображения.');
            console.error('Ошибка:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const openStoryEditor = async () => {
        const randomImage = await getRandomImage();
        if (randomImage) {
            vkBridge.send("VKWebAppShowStoryBox", {
                background_type: 'image',
                url: randomImage,
                locked: false
            })
        }

    };

    return (
        <Panel id={id}>
            <PanelHeader>Главная</PanelHeader>
            {fetchedUser && (
                <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
                    <Cell before={photo_200 && <Avatar src={photo_200}/>} subtitle={city?.title}>
                        {`${first_name} ${last_name}`}
                    </Cell>
                </Group>
            )}

            <Group header={<Header mode="secondary">Navigation Example</Header>}>
                <Div>
                    <Button
                        stretched
                        size="l"
                        mode="secondary"
                        onClick={openStoryEditor}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Открыть редактор историй'}
                    </Button>
                </Div>
            </Group>
        </Panel>
    );
};

Home.propTypes = {
    id: PropTypes.string.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};
